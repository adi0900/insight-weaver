#!/usr/bin/env python3
"""
Insight Weaver — Data Watcher
Hot-reloads data transformations when source files change.
"""

import os
import time
import hashlib
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

WATCH_DIRS = [
    Path(__file__).parent / "sources",
    Path(__file__).parent / "transforms",
]

file_hashes: dict[str, str] = {}


def get_file_hash(filepath: Path) -> str:
    """Calculate MD5 hash of file contents."""
    with open(filepath, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def check_for_changes() -> list[Path]:
    """Check for changed files and return list of changed paths."""
    changed = []
    
    for watch_dir in WATCH_DIRS:
        if not watch_dir.exists():
            watch_dir.mkdir(parents=True, exist_ok=True)
            continue
            
        for filepath in watch_dir.rglob("*.py"):
            current_hash = get_file_hash(filepath)
            stored_hash = file_hashes.get(str(filepath))
            
            if stored_hash != current_hash:
                file_hashes[str(filepath)] = current_hash
                if stored_hash is not None:  # Skip initial load
                    changed.append(filepath)
    
    return changed


def process_change(filepath: Path) -> None:
    """Process a changed file."""
    print(f"[WATCH] Detected change: {filepath.name}")
    
    # In production, reload and re-execute the transform
    # For now, just log the change
    print(f"[WATCH] Would reload transform: {filepath.stem}")


def main() -> None:
    """Main watch loop."""
    print("=" * 50)
    print("Insight Weaver — Data Watcher")
    print("=" * 50)
    print(f"Watching directories:")
    for d in WATCH_DIRS:
        print(f"  - {d}")
    print("Press Ctrl+C to stop.")
    print()
    
    # Initial hash calculation
    check_for_changes()
    print(f"[WATCH] Watching {len(file_hashes)} files...")
    
    try:
        while True:
            changed_files = check_for_changes()
            for filepath in changed_files:
                process_change(filepath)
            time.sleep(1)  # Check every second
    except KeyboardInterrupt:
        print("\n[WATCH] Stopped watching.")


if __name__ == "__main__":
    main()
