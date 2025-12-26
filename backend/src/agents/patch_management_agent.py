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

class PatchManagementAgent:
    def __init__(self, context=None, channel=None):
        self.context = None
        self.channel = None

    def identify_patches(self, vulnerability_data):
        if not genai_client:
            return "AI patch identification unavailable"
        try:
            prompt = f"Identify patches for the following vulnerabilities:\n{vulnerability_data}\nPatches:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            patches = getattr(response, 'text', None) or str(response)
            return patches
        except Exception as e:
            print("PatchManagementAgent Gemini error:", e)
            return "AI patch identification unavailable"

    def test_patches(self, patches):
        if not genai_client:
            return "AI test unavailable"
        try:
            prompt = f"Test the following patches:\n{patches}\nTest Results:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            test_results = getattr(response, 'text', None) or str(response)
            return test_results
        except Exception as e:
            print("PatchManagementAgent Gemini error:", e)
            return "AI test unavailable"

    def deploy_patches(self, test_results):
        if not genai_client:
            return "AI deployment unavailable"
        try:
            prompt = f"Deploy the following patches based on test results:\n{test_results}\nDeployment Status:"
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            deployment_status = getattr(response, 'text', None) or str(response)
            return deployment_status
        except Exception as e:
            print("PatchManagementAgent Gemini error:", e)
            return "AI deployment unavailable"

    def on_message(self, ch, method, properties, body):
        message = json.loads(body)
        vulnerability_data = message.get("vulnerability_data")
        if vulnerability_data:
            patches = self.identify_patches(vulnerability_data)
            test_results = self.test_patches(patches)
            deployment_status = self.deploy_patches(test_results)
            self.send_message(json.dumps({"deployment_status": deployment_status}))

    def send_message(self, message):
        payload = {"event": "agent_message", "agent": "PatchManagementAgent", "message": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("PatchManagementAgent message:", message)

    def start(self):
        print("PatchManagementAgent ready (no ZMQ/RabbitMQ).")


if __name__ == "__main__":
    agent = PatchManagementAgent()
    agent.start()
