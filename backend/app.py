from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI-Driven Cybersecurity Backend")

# CORS: allows your frontend (running on a different port/domain) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Request Schemas (what frontend sends) ---------
class ThreatDetectRequest(BaseModel):
    traffic_data: str

class VulnerabilityAssessRequest(BaseModel):
    system_data: str

class IncidentResponseRequest(BaseModel):
    threat_data: str

class PatchManagementRequest(BaseModel):
    vulnerability_data: str


# --------- Basic endpoints ---------
@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Backend is running"}


# --------- Feature endpoints (demo logic for now) ---------
@app.post("/api/threat-detect")
def threat_detect(req: ThreatDetectRequest):
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
    # Demo response plan
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
    # Demo patch recommendation
    return {
        "deployment_status": [
            "Identify affected software versions (demo)",
            "Apply latest security updates in staging (demo)",
            "Run regression + security tests (demo)",
            "Deploy to production during maintenance window (demo)"
        ],
        "received_chars": len(req.vulnerability_data)
    }