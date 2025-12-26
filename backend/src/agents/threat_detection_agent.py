import os
import json
import asyncio
from src.ml_model import ThreatModel

try:
    import google.genai as genai
    genai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
except Exception:
    genai = None
    genai_client = None

try:
    from ws_manager import ws_manager
except Exception:
    ws_manager = None

class ThreatDetectionAgent:
    def __init__(self, context=None, channel=None):
        self.context = None
        self.channel = None
        self.model = ThreatModel()

    def analyze_traffic(self, traffic_data):
        if not genai_client:
            return self._heuristic_analysis(traffic_data)

        try:
            prompt = f"Analyze the following network traffic data for potential threats:\n{traffic_data}\nThreats:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            threats = getattr(response, 'text', None) or str(response)
            return threats
        except Exception as e:
            print(f"Gemini analysis failed: {e}")
            return self._heuristic_analysis(traffic_data)

    def _heuristic_analysis(self, traffic_data):
        # 1. Try ML Model
        try:
             features = json.loads(traffic_data)
             if isinstance(features, dict):
                 pred, score = self.model.predict(features)
                 if pred == -1:
                     return f"ML Anomaly Detected (Score: {score:.2f})"
        except:
             pass

        # 2. Fallback to Rules
        text = traffic_data.lower()
        threats = []
        if "union select" in text: threats.append("SQL Injection")
        if "script" in text and "<" in text: threats.append("XSS")
        if not threats: return "No threats detected (Heuristic)"
        return ", ".join(threats)

    def on_message(self, ch, method, properties, body):
        message = json.loads(body)
        traffic_data = message.get("traffic_data")
        if traffic_data:
            threats = self.analyze_traffic(traffic_data)
            self.send_message(json.dumps({"threats": threats}))

    def send_message(self, message):
        payload = {"event": "agent_message", "agent": "ThreatDetectionAgent", "message": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("ThreatDetectionAgent message:", message)

    def start(self):
        print("ThreatDetectionAgent ready (no ZMQ/RabbitMQ).")


if __name__ == "__main__":
    agent = ThreatDetectionAgent()
    agent.start()
