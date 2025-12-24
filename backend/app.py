import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, ".env")
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI(title="AI-Driven Cybersecurity Backend")

# --------- Supabase Configuration ---------
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        # Confirm DB connection
        print("Connected with Supabase DB")
    except Exception as e:
        print(f"Failed to connect to Supabase: {e}")
else:
    print("WARNING: Supabase credentials not found in environment variables.")

# --------- CORS Configuration ---------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Request Schemas ---------
class ThreatDetectRequest(BaseModel):
    traffic_data: str

class VulnerabilityAssessRequest(BaseModel):
    system_data: str

class IncidentResponseRequest(BaseModel):
    threat_data: str

class PatchManagementRequest(BaseModel):
    vulnerability_data: str


# --------- Basic Endpoints ---------
@app.get("/api/health")
def health():
    return {
        "status": "ok", 
        "message": "Backend is running",
        "supabase_connected": supabase is not None
    }


# --------- Feature Endpoints ---------
@app.post("/api/threat-detect")
async def threat_detect(req: ThreatDetectRequest):
    text = req.traffic_data.lower()
    threats = []

    if "login" in text and "failed" in text:
        threats.append("Brute-force login attempts (demo)")
    if "password" in text and ("post" in text or "http" in text):
        threats.append("Possible credential exfiltration (demo)")
    if "sql" in text and ("union" in text or "select" in text or "drop" in text):
        threats.append("Possible SQL injection pattern (demo)")

    if not threats:
        threats.append("No obvious threat found (demo)")

    # Save to Supabase if connected
    if supabase:
        try:
            supabase.table("threat_logs").insert({
                "traffic_data": req.traffic_data,
                "detected_threats": threats
            }).execute()
        except Exception as e:
            print(f"Supabase Insert Error: {e}")

    return {
        "threats": threats,
        "received_chars": len(req.traffic_data)
    }


@app.post("/api/vulnerability-assess")
def vulnerability_assess(req: VulnerabilityAssessRequest):
    text = req.system_data.lower()
    vulns = []

    if "windows 7" in text or "windows xp" in text:
        vulns.append("Unsupported OS detected (demo)")
    if "admin:admin" in text or "password" in text:
        vulns.append("Weak/default credentials risk (demo)")
    if "port 3389" in text or "rdp" in text:
        vulns.append("RDP exposure risk (demo)")

    if not vulns:
        vulns.append("No obvious vulnerabilities found (demo)")

    return {"vulnerabilities": vulns}


@app.post("/api/incident-response")
def incident_response(req: IncidentResponseRequest):
    return {
        "response_action": [
            "Isolate affected machine from network (demo)",
            "Block suspicious IPs at firewall (demo)",
            "Reset compromised credentials (demo)",
            "Collect logs for forensics (demo)"
        ],
        "received_chars": len(req.threat_data)
    }


@app.post("/api/patch-management")
def patch_management(req: PatchManagementRequest):
    return {
        "deployment_status": [
            "Identify affected software versions (demo)",
            "Apply latest security updates in staging (demo)",
            "Run regression + security tests (demo)",
            "Deploy to production during maintenance window (demo)"
        ],
        "received_chars": len(req.vulnerability_data)
    }