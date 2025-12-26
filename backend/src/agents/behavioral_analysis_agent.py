import os
import json
import asyncio
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

class BehavioralAnalysisAgent:
    def __init__(self, context=None, channel=None):
        self.context = None
        self.channel = None

    def analyze_behavior(self, behavior_data):
        if not genai_client:
            return "AI behavioral analysis unavailable"
        try:
            prompt = f"Analyze the following user and system behavior data for anomalies:\n{behavior_data}\nAnomalies:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            anomalies = getattr(response, 'text', None) or str(response)
            return anomalies
        except Exception as e:
            print("BehavioralAnalysisAgent Gemini error:", e)
            return "AI behavioral analysis unavailable"

    def on_message(self, ch, method, properties, body):
        message = json.loads(body)
        behavior_data = message.get("behavior_data")
        if behavior_data:
            anomalies = self.analyze_behavior(behavior_data)
            self.send_message(json.dumps({"anomalies": anomalies}))

    def send_message(self, message):
        payload = {"event": "agent_message", "agent": "BehavioralAnalysisAgent", "message": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("BehavioralAnalysisAgent message:", message)

    def start(self):
        print("BehavioralAnalysisAgent ready (no ZMQ/RabbitMQ).")


if __name__ == "__main__":
    agent = BehavioralAnalysisAgent()
    agent.start()
