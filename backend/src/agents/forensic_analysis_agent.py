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

class ForensicAnalysisAgent:
    def __init__(self, context=None, channel=None):
        self.context = None
        self.channel = None

    def perform_analysis(self, compromised_system_data):
        if not genai_client:
            return "AI forensic analysis unavailable"
        try:
            prompt = f"Perform forensic analysis on the following compromised system data:\n{compromised_system_data}\nAnalysis:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            analysis_result = getattr(response, 'text', None) or str(response)
            return analysis_result
        except Exception as e:
            print("ForensicAnalysisAgent Gemini error:", e)
            return "AI forensic analysis unavailable"

    def on_message(self, ch, method, properties, body):
        message = json.loads(body)
        compromised_system_data = message.get("compromised_system_data")
        if compromised_system_data:
            analysis_result = self.perform_analysis(compromised_system_data)
            self.send_message(json.dumps({"analysis_result": analysis_result}))

    def send_message(self, message):
        payload = {"event": "agent_message", "agent": "ForensicAnalysisAgent", "message": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("ForensicAnalysisAgent message:", message)

    def start(self):
        print("ForensicAnalysisAgent ready (no ZMQ/RabbitMQ).")


if __name__ == "__main__":
    agent = ForensicAnalysisAgent()
    agent.start()
