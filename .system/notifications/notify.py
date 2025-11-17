"""Simple notification sound script for Claude Code task completion"""
import winsound
import sys

def beep():
    """Play a single soft beep sound for Claude Code"""
    winsound.Beep(300, 200)  # Soft beep: 300 Hz for 200ms

if __name__ == "__main__":
    beep()
