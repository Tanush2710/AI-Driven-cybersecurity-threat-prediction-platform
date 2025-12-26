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

class IncidentResponseAgent:
    def __init__(self, context=None, channel=None):
        self.context = None
        self.channel = None

    def respond_to_threat(self, threat_data):
        if not genai_client:
            return "AI response unavailable"
        try:
            prompt = f"Respond to the following threat data:\n{threat_data}\nResponse:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            response_action = getattr(response, 'text', None) or str(response)
            return response_action
        except Exception as e:
            print("IncidentResponseAgent Gemini error:", e)
            return "AI response unavailable"

    def on_message(self, ch, method, properties, body):
        message = json.loads(body)
        threat_data = message.get("threat_data")
        if threat_data:
            response_action = self.respond_to_threat(threat_data)
            self.send_message(json.dumps({"response_action": response_action}))

    def send_message(self, message):
        payload = {"event": "agent_message", "agent": "IncidentResponseAgent", "message": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("IncidentResponseAgent message:", message)

    def start(self):
        print("IncidentResponseAgent ready (no ZMQ/RabbitMQ).")


if __name__ == "__main__":
    agent = IncidentResponseAgent()
    agent.start()
