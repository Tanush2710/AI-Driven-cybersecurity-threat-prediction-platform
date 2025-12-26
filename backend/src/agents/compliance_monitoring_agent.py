import json
import asyncio

try:
    from ws_manager import ws_manager
except Exception:
    ws_manager = None


class ComplianceMonitoringAgent:
    def __init__(self, context=None, channel=None):
        self.context = None
        self.channel = None

    def monitor_compliance(self, system_data):
        # Placeholder for compliance monitoring logic
        compliance_status = "Compliant" if "security_policy" in system_data else "Non-Compliant"
        return compliance_status

    def on_message(self, ch, method, properties, body):
        message = json.loads(body)
        system_data = message.get("system_data")
        if system_data:
            compliance_status = self.monitor_compliance(system_data)
            self.send_message(json.dumps({"compliance_status": compliance_status}))

    def send_message(self, message):
        payload = {"event": "agent_message", "agent": "ComplianceMonitoringAgent", "message": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("ComplianceMonitoringAgent message:", message)

    def start(self):
        print("ComplianceMonitoringAgent ready (no ZMQ/RabbitMQ).")


if __name__ == "__main__":
    agent = ComplianceMonitoringAgent()
    agent.start()
