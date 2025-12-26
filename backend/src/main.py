import gymnasium as gym
import ray
import json
import warnings
import time
import asyncio

try:
    from ws_manager import ws_manager
except Exception:
    ws_manager = None

warnings.filterwarnings("ignore", category=FutureWarning)

# System Initialization
def initialize_system():
    # Gym environment
    env = gym.make("CartPole-v1")

    # Ray
    ray.init(ignore_reinit_error=True)
    return env, None, None


# Agent Policy (TEMPORARY DUMMY)
def integrate_gym_agent(env):
    action_space = env.action_space

    def agent_policy(_observation):
        # Random policy (safe placeholder)
        return action_space.sample()

    return agent_policy


# Communication Layer
def implement_communication_protocols(context, channel):
    # Legacy function kept for compatibility; do best-effort WS broadcast
    def send_message(message: str):
        payload = {"event": "system", "payload": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        print("send_message fallback:", message)

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
    
