import os
import json
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
import asyncio
from fastapi import FastAPI, HTTPException, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, ".env")
load_dotenv(dotenv_path=dotenv_path)

from src.agents.threat_detection_agent import ThreatDetectionAgent
from src.agents.vulnerability_assessment_agent import VulnerabilityAssessmentAgent
from src.agents.incident_response_agent import IncidentResponseAgent
from src.agents.behavioral_analysis_agent import BehavioralAnalysisAgent
from src.agents.compliance_monitoring_agent import ComplianceMonitoringAgent
from src.agents.forensic_analysis_agent import ForensicAnalysisAgent
from src.agents.patch_management_agent import PatchManagementAgent
from src.agents.patch_management_agent import PatchManagementAgent
from src.agents.deception_agent import DeceptionAgent
from src.data_pipeline.ingestion import parse_training_data
from src.ml_model import ThreatModel

app = FastAPI(title="AI-Driven Cybersecurity Backend")

# WebSocket manager (real-time dashboard)
from ws_manager import ws_manager

# --------- Configuration ---------
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment")

import google.genai as genai
client = genai.Client(api_key=GEMINI_API_KEY)

# --------- Gemini Helper ---------
def gemini_generate(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print("Gemini error:", e)
        return "AI analysis unavailable"

threat_model = ThreatModel()
supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected with Supabase DB")
    except Exception as e:
        print(f"Failed to connect to Supabase: {e}")
else:
    print("WARNING: Supabase credentials not found.")

# --------- CORS ---------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Models ---------
class ThreatDetectRequest(BaseModel):
    traffic_data: str
    source_ip: str = "Unknown"
    protocol: str = "TCP"

class ActivityLog(BaseModel):
    type: str # info, success, warning, error
    message: str
    agent_name: str

# --------- Logic Helpers ---------
def log_activity(type: str, message: str, agent_name: str):
    payload = {
        "event": "activity",
        "type": type,
        "message": message,
        "agent_name": agent_name,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Send real-time update (best-effort)
    try:
        asyncio.create_task(ws_manager.broadcast(payload))
    except RuntimeError:
        pass

    # Persist to DB
    if not supabase:
        return

    try:
        supabase.table("system_activities").insert({
            "type": type,
            "message": message,
            "agent_name": agent_name
        }).execute()
    except Exception as e:
        print("Activity Log Error:", e)

# --------- Endpoints ---------

@app.get("/")
def health():
    return {
        "status": "ok",
        "supabase_connected": supabase is not None
    }

@app.get("/api/activity-feed")
def get_activity_feed():
    if not supabase:
        return []
    try:
        # Fetch last 10 activities
        response = supabase.table("system_activities").select("*").order("created_at", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        print(f"Fetch Feed Error: {e}")
        return []

@app.get("/api/recent-threats")
def get_recent_threats():
    if not supabase:
        return []
    try:
        # Fetch last 5 threats
        response = supabase.table("threat_logs").select("*").order("created_at", desc=True).limit(5).execute()
        return response.data
    except Exception as e:
        print(f"Fetch Threats Error: {e}")
        return []

@app.post("/api/upload-training-data")
async def upload_training_data(file: UploadFile = File(...)):
    try:
        content = await file.read()
        df = parse_training_data(content, file.content_type)
        if df is not None:
             # Save locally for training
             df.to_csv("training_data.csv", index=False)
             return {"status": "success", "message": f"Uploaded {len(df)} rows for training"}
        return {"status": "error", "message": "Could not parse file"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/train-model")
async def train_model_endpoint():
    try:
        import pandas as pd
        if os.path.exists("training_data.csv"):
            df = pd.read_csv("training_data.csv")
            result = threat_model.train(df)
            return result
        return {"status": "error", "message": "No training data found (training_data.csv)"}
    except Exception as e:
         return {"status": "error", "message": str(e)}

@app.post("/api/threat-detect")
async def threat_detect(req: ThreatDetectRequest):
    threats = []
    
    # 1. Log Raw Traffic
    traffic_id = None
    if supabase:
        try:
            res = supabase.table("network_traffic").insert({
                "payload": req.traffic_data,
                "source_ip": req.source_ip,
                "protocol": req.protocol,
                "size_bytes": len(req.traffic_data)
            }).execute()
            if res.data:
                traffic_id = res.data[0]['id']
        except Exception as e:
            print(f"Traffic Log Error: {e}")

    # 2. AI / Rule-based Analysis
    # Try ML model first if input is JSON-like features
    text = req.traffic_data.lower()
    
    try:
        import json
        features = json.loads(req.traffic_data)
        if isinstance(features, dict):
             # Basic mapping/validation could happen here
             pred, score = threat_model.predict(features)
             if pred == -1:
                 threats.append({
                     "type": "Anomaly Detected (ML)", 
                     "severity": "critical" if score < -0.1 else "medium", 
                     "desc": f"Deviation from normal pattern (score: {score:.2f})"
                 })
    except json.JSONDecodeError:
        pass

    # Fallback/Additional Rule-based Checks
    
    if "union select" in text or "drop table" in text:
        threats.append({"type": "SQL Injection", "severity": "critical", "desc": "Database manipulation attempt detected"})
    elif "script" in text and "<" in text:
        threats.append({"type": "XSS Attack", "severity": "high", "desc": "Malicious script tag detected"})
    elif "password" in text and "admin" in text:
         threats.append({"type": "Credential Leak", "severity": "high", "desc": "Potential cleartext password found"})
         
    # 3. Log Threats & Update Activity
    if threats:
        # Broadcast threat alert to dashboard (async best-effort)
        try:
            asyncio.create_task(ws_manager.broadcast({
                "event": "threat",
                "source_ip": req.source_ip,
                "protocol": req.protocol,
                "threats": threats,
                "timestamp": datetime.utcnow().isoformat()
            }))
        except RuntimeError:
            pass
        for t in threats:
            if supabase and traffic_id:
                try:
                    supabase.table("threat_logs").insert({
                        "traffic_id": traffic_id,
                        "threat_type": t["type"],
                        "severity": t["severity"],
                        "description": t["desc"],
                        "status": "detected"
                    }).execute()
                except Exception as e:
                     print(f"Threat Log Error: {e}")
            
            # Log to activity feed
            log_activity("warning", f"Detected {t['type']} from {req.source_ip}", "Hunter-02")
    else:
        log_activity("success", f"Traffic scanned - Clean", "Sentinel-01")

    return {
        "status": "analyzed",
        "threats_found": len(threats),
        "details": threats
    }

# --------- Agent Integration ---------

class RunAgentRequest(BaseModel):
    agent_name: str
    input_data: str

def run_agent_helper(agent_name: str, input_data: str):
    """
    Instantiates the requested agent and runs its main analysis method.
    Returns the result string or dict.
    """
    result = "Agent not found or Error"
    
    try:
        if agent_name == "Threat Detection Agent":
            agent = ThreatDetectionAgent()
            result = agent.analyze_traffic(input_data)
            
        elif agent_name == "Vulnerability Assessment Agent":
            agent = VulnerabilityAssessmentAgent()
            result = agent.assess_vulnerabilities(input_data)
            
        elif agent_name == "Incident Response Agent":
            agent = IncidentResponseAgent()
            result = agent.respond_to_threat(input_data)
            
        elif agent_name == "Behavioral Analysis Agent":
            agent = BehavioralAnalysisAgent()
            result = agent.analyze_behavior(input_data)
            
        elif agent_name == "Compliance Monitoring Agent":
            agent = ComplianceMonitoringAgent()
            result = agent.monitor_compliance(input_data)
            
        elif agent_name == "Forensic Analysis Agent":
            agent = ForensicAnalysisAgent()
            result = agent.perform_analysis(input_data)
            
        elif agent_name == "Patch Management Agent":
            agent = PatchManagementAgent()
            # For demo, we chain the methods or just call identify
            patches = agent.identify_patches(input_data)
            result = f"Patches Identified: {patches}"
            
        elif agent_name == "Deception Agent":
            agent = DeceptionAgent()
            # Deception agent is a bit different, it deploys honeypots. 
            # We'll map 'input_data' to 'honeypot_data'
            result = agent.deploy_honeypot(input_data)
            
        else:
            return f"Unknown agent: {agent_name}"
            
    except Exception as e:
        print(f"Error running agent {agent_name}: {e}")
        return f"Error: {str(e)}"

    return result

@app.post("/api/run-agent")
async def run_agent_endpoint(req: RunAgentRequest):
    # 1. Run the agent
    output_data = run_agent_helper(req.agent_name, req.input_data)
    
    # 2. Log to agent_logs
    log_id = None
    if supabase:
        try:
            res = supabase.table("agent_logs").insert({
                "agent_name": req.agent_name,
                "input_data": req.input_data,
                "output_data": str(output_data)
            }).execute()
            if res.data:
                log_id = res.data[0]['id']
        except Exception as e:
            print(f"Agent Log Error: {e}")

    # 3. Log to system activities for the feed
    log_activity("info", f"activated on input data", req.agent_name)

    return {
        "status": "success",
        "agent": req.agent_name,
        "result": output_data,
        "log_id": log_id
    }

@app.get("/api/agent-logs")
def get_agent_logs(agent_name: str = None):
    if not supabase:
        return []
    try:
        query = supabase.table("agent_logs").select("*").order("created_at", desc=True).limit(20)
        if agent_name:
            query = query.eq("agent_name", agent_name)
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Fetch Agent Logs Error: {e}")
        return []


@app.websocket("/ws/dashboard")
async def dashboard_ws(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive; frontend may send pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
