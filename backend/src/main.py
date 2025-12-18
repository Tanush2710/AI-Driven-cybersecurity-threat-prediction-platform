import gymnasium as gym
import ray
import zmq
import pika
import json
import warnings
import time

warnings.filterwarnings("ignore", category=FutureWarning)

# System Initialization
def initialize_system():
    # Gym environment
    env = gym.make("CartPole-v1")

    # Ray
    ray.init(ignore_reinit_error=True)

    # ZeroMQ
    context = zmq.Context()

    # RabbitMQ (kep in optional)
    channel = None
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters("localhost")
        )
        channel = connection.channel()
        channel.queue_declare(queue="agent_queue")
        print("RabbitMQ connected")
    except pika.exceptions.AMQPConnectionError:
        print("RabbitMQ not running — AMQP disabled")

    return env, context, channel


# Agent Policy (TEMPORARY DUMMY)
def integrate_gym_agent(env):
    action_space = env.action_space

    def agent_policy(_observation):
        # Random policy (safe placeholder)
        return action_space.sample()

    return agent_policy


# Communication Layer
def implement_communication_protocols(context, channel):
    # ZeroMQ publisher
    socket = context.socket(zmq.PUB)
    socket.bind("tcp://*:5555")

    def send_message(message: str):
        # Always send via ZeroMQ
        socket.send_string(message)

        # Send via RabbitMQ only if available
        if channel is not None:
            channel.basic_publish(
                exchange="",
                routing_key="agent_queue",
                body=message,
            )

    return send_message


# Main Entry Point
if __name__ == "__main__":
    env, context, channel = initialize_system()
    agent_policy = integrate_gym_agent(env)
    send_message = implement_communication_protocols(context, channel)

    # Gymnasium reset API (correct)
    observation, info = env.reset()

    action = agent_policy(observation)

    payload = {
    "observation": observation.tolist(),
    "action": int(action),
}

    send_message(json.dumps(payload))

print("System running — press Ctrl+C to stop")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutdown requested")
    
