#!/usr/bin/env python3
import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv

def main():
    # Load environment variables from .env.local if it exists
    env_local = Path(".env.local")
    if env_local.exists():
        print("Loading environment from .env.local")
        load_dotenv(dotenv_path=env_local)
    else:
        print("Loading environment from .env")
        load_dotenv()

    # Add current directory to path
    current_dir = Path(__file__).parent
    sys.path.insert(0, str(current_dir))

    print(f"Starting Worker connected to: {os.getenv('SURREAL_URL')}")
    
    # Run the worker command
    # .venv/bin/surreal-commands-worker --import-modules commands
    worker_script = current_dir / ".venv" / "bin" / "surreal-commands-worker"
    if not worker_script.exists():
        print(f"Error: Worker script not found at {worker_script}")
        return

    cmd = [
        str(worker_script),
        "--import-modules", "commands"
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    
    subprocess.run(cmd, cwd=current_dir)

if __name__ == "__main__":
    main()
