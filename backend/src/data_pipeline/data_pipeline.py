import json
import requests
import asyncio

try:
    from ws_manager import ws_manager
except Exception:
    ws_manager = None


class DataPipeline:
    def __init__(self):
        pass

    def fetch_threat_intelligence(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None

    def process_data(self, data):
        # Process and normalize data
        processed_data = json.dumps(data)
        return processed_data

    def send_data(self, data):
        payload = {"event": "pipeline", "data": data}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("Data pipeline fallback:", data)

    def run_pipeline(self, url):
        data = self.fetch_threat_intelligence(url)
        if data:
            processed_data = self.process_data(data)
            self.send_data(processed_data)


if __name__ == "__main__":
    pipeline = DataPipeline()
    threat_intelligence_url = "https://example.com/threat_intelligence"
    pipeline.run_pipeline(threat_intelligence_url)
