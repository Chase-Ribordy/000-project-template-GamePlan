#!/usr/bin/env python3
"""
Pass Completion Notification System

Sends notifications to operator at key checkpoints in the development workflow.
Called by Claude Code hooks after each pass completes.

Usage:
    python notify.py <event_type> [message]

Events:
    - refine_complete: Idea pipeline finished
    - sprint_setup_complete: SM finished creating stories/chunks
    - pass_1_complete: First pass (skeleton) done
    - pass_2_complete: Second pass (UI/polish) done
    - pass_3_complete: Third pass (bugs/production) done
    - sprint_complete: All passes done, ready for testing
"""

import sys
import os
from datetime import datetime

def log_notification(event: str, message: str = ""):
    """Log notification to file for operator review."""
    log_dir = os.path.dirname(os.path.abspath(__file__))
    log_file = os.path.join(log_dir, "notifications.log")

    timestamp = datetime.now().isoformat()

    notifications = {
        "refine_complete": "IDEA PIPELINE COMPLETE - Ready for /orc-exe",
        "sprint_setup_complete": "SPRINT SETUP COMPLETE - Stories and chunks created",
        "pass_1_complete": "FIRST PASS COMPLETE - Skeleton built, ready for review",
        "pass_2_complete": "SECOND PASS COMPLETE - UI polished, ready for review",
        "pass_3_complete": "THIRD PASS COMPLETE - Bugs fixed, production ready",
        "sprint_complete": "SPRINT COMPLETE - All passes done, ready for testing",
        "chunk_complete": "CHUNK COMPLETE - Parallel work stream finished",
    }

    display_message = notifications.get(event, message or event)

    log_entry = f"[{timestamp}] {event.upper()}: {display_message}\n"

    # Append to log file
    with open(log_file, "a") as f:
        f.write(log_entry)

    # Print to console for immediate visibility
    print(f"\n{'='*50}")
    print(f"CHECKPOINT: {display_message}")
    print(f"{'='*50}\n")

    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python notify.py <event_type> [message]")
        sys.exit(1)

    event = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else ""

    log_notification(event, message)

if __name__ == "__main__":
    main()
