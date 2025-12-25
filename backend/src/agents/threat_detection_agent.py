import os
import json
try:
    import openai
except ImportError:
    openai = None
import zmq
import pika
import json
from src.ml_model import ThreatModel

class ThreatDetectionAgent:
    def __init__(self, context=None, channel=None):
        self.context = context
        self.channel = channel
        self.model = ThreatModel()
        
        # Only setup ZMQ if context is provided (Agent Mode)
        if self.context:
            self.socket = self.context.socket(zmq.SUB)
            self.socket.connect("tcp://localhost:5555")
            self.socket.setsockopt_string(zmq.SUBSCRIBE, '')

        # Only setup RabbitMQ if channel is provided
        if self.channel:
            self.channel.queue_declare(queue='agent_queue')
            self.channel.basic_consume(queue='agent_queue', on_message_callback=self.on_message, auto_ack=True)

    def analyze_traffic(self, traffic_data):
        # Fallback if OpenAI is not configured or fails
        if not openai or not os.environ.get("OPENAI_API_KEY"):
            return self._heuristic_analysis(traffic_data)

        try:
            response = openai.Completion.create(
                engine="Meta-Llama-3.1-8B-Instruct", 
                prompt=f"Analyze the following network traffic data for potential threats:\n{traffic_data}\nThreats:",
                max_tokens=50
            )
            threats = response.choices[0].text.strip()
            return threats
        except Exception as e:
            print(f"AI Analysis failed: {e}")
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
        if self.socket:
            self.socket.send_string(message)
        if self.channel:
            self.channel.basic_publish(exchange='',
                                   routing_key='agent_queue',
                                   body=message)

    def start(self):
        if self.channel and self.context:
            print("Threat Detection Agent Started (Listening Mode)...")
            while True:
                self.channel.start_consuming()
                if self.socket:
                    message = self.socket.recv_string()
                    print(f"Received message: {message}")

if __name__ == "__main__":
    context = zmq.Context()
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    agent = ThreatDetectionAgent(context, channel)
    agent.start()
