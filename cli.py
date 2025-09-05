import random
import threading
import time
import sys

BREACH_STEP = 5
LOG_INTERVAL = 0.5
ATTACK_INTERVAL = 1

def random_ip():
    return ".".join(str(random.randint(0, 255)) for _ in range(4))

def random_log():
    ips = f"{random_ip()} -> {random_ip()}"
    msgs = [
        f"Connection from {ips}",
        f"Packet sniff {ips}",
        f"AUTH FAIL {ips}",
        f"Decrypting cipher from {ips}",
        f"Launching trace route to {random_ip()}"
    ]
    return random.choice(msgs)

def log_generator(stop_event):
    while not stop_event.is_set():
        print(random_log())
        time.sleep(LOG_INTERVAL)

def attack_progress(stop_event, breach_state):
    while not stop_event.is_set():
        time.sleep(ATTACK_INTERVAL)
        breach_state[0] += BREACH_STEP
        level = breach_state[0]
        if level == 30:
            print("Perimeter breached")
        elif level == 60:
            print("Internal firewall compromised")
        elif level >= 100:
            print("Core systems infiltrated: data exfiltration in progress")
            breach_state[0] = 0

def input_listener(stop_event, breach_state):
    try:
        while not stop_event.is_set():
            cmd = input()
            cmd = cmd.strip().lower()
            if cmd in ("exit", "quit"):
                stop_event.set()
            elif cmd == "counter":
                breach_state[0] = 0
                print("Countermeasure deployed, attacker traced")
    except EOFError:
        stop_event.set()


def main():
    print("Hollywood Hacker CLI Simulator")
    print('Type "counter" to deploy countermeasures or "exit" to quit.')
    stop_event = threading.Event()
    breach_state = [0]

    threads = [
        threading.Thread(target=log_generator, args=(stop_event,), daemon=True),
        threading.Thread(target=attack_progress, args=(stop_event, breach_state), daemon=True),
        threading.Thread(target=input_listener, args=(stop_event, breach_state), daemon=True),
    ]

    for t in threads:
        t.start()

    try:
        while not stop_event.is_set():
            time.sleep(0.1)
    except KeyboardInterrupt:
        stop_event.set()

    print("Shutting down...")

if __name__ == "__main__":
    main()
