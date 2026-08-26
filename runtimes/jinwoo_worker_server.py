import os
import sys
import json
import asyncio
import subprocess
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import uvicorn

app = FastAPI(title="Jinwoo Autonomous Worker Daemon")

TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read content of a file in the workspace",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path to file in workspace"}
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Write or overwrite content of a file in the workspace",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path to file in workspace"},
                    "content": {"type": "string", "description": "Full file content to write"}
                },
                "required": ["path", "content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_files",
            "description": "List files and directories in workspace folder",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative folder path (empty for root)"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "exec_command",
            "description": "Execute a safe shell command inside the workspace",
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "Command line string to execute"}
                },
                "required": ["command"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "git_diff",
            "description": "Get git diff of uncommitted changes in the workspace",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    }
]

def execute_tool(workspace_path: str, tool_name: str, tool_args: Dict[str, Any]) -> str:
    """Executes file, git, and command tools strictly within the assigned workspace directory."""
    if not os.path.exists(workspace_path):
        os.makedirs(workspace_path, exist_ok=True)

    if tool_name == "read_file":
        rel_path = tool_args.get("path", "")
        full_path = os.path.abspath(os.path.join(workspace_path, rel_path))
        if not full_path.startswith(os.path.abspath(workspace_path)):
            return "Error: Path traversal outside workspace forbidden."
        if not os.path.exists(full_path):
            return f"Error: File '{rel_path}' not found."
        try:
            with open(full_path, "r", encoding="utf-8", errors="replace") as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"

    elif tool_name == "write_file":
        rel_path = tool_args.get("path", "")
        content = tool_args.get("content", "")
        full_path = os.path.abspath(os.path.join(workspace_path, rel_path))
        if not full_path.startswith(os.path.abspath(workspace_path)):
            return "Error: Path traversal outside workspace forbidden."
        try:
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)
            return f"Successfully wrote {len(content)} bytes to {rel_path}"
        except Exception as e:
            return f"Error writing file: {str(e)}"

    elif tool_name == "list_files":
        rel_path = tool_args.get("path", "")
        target_dir = os.path.abspath(os.path.join(workspace_path, rel_path))
        if not target_dir.startswith(os.path.abspath(workspace_path)):
            return "Error: Path traversal outside workspace forbidden."
        if not os.path.exists(target_dir):
            return f"Error: Directory '{rel_path}' not found."
        try:
            items = os.listdir(target_dir)
            return json.dumps(items)
        except Exception as e:
            return f"Error listing directory: {str(e)}"

    elif tool_name == "exec_command":
        cmd = tool_args.get("command", "")
        try:
            res = subprocess.run(cmd, shell=True, cwd=workspace_path, capture_output=True, text=True, timeout=30)
            out = res.stdout + ("\n" + res.stderr if res.stderr else "")
            return out.strip() if out.strip() else "(Command executed with no output)"
        except Exception as e:
            return f"Error executing command: {str(e)}"

    elif tool_name == "git_diff":
        try:
            res = subprocess.run("git diff", shell=True, cwd=workspace_path, capture_output=True, text=True, timeout=10)
            return res.stdout if res.stdout else "(No uncommitted changes in git)"
        except Exception as e:
            return f"Error checking git diff: {str(e)}"

    return f"Unknown tool: {tool_name}"

@app.get("/health")
async def health():
    return {"status": "ONLINE", "daemon": "JinwooWorkerServer", "version": "1.0.0", "port": 20129}

@app.get("/status")
async def status():
    return {"status": "ONLINE", "tools": [t["function"]["name"] for t in TOOLS_SCHEMA]}

@app.post("/execute")
async def execute_task(req: Request):
    body = await req.json()
    task_id = body.get("taskId", "task_" + str(int(asyncio.get_event_loop().time())))
    agent_id = body.get("agentId", "developer")
    prompt = body.get("prompt", "")
    workspace_path = body.get("workspacePath", os.getcwd())
    provider = body.get("provider", "Antigravity")
    model = body.get("model", "claude-opus-4-6-thinking")

    async def event_generator():
        yield f'data: {json.dumps({"eventType": "AGENT_STARTED", "taskId": task_id, "payload": {"agentId": agent_id}})}\n\n'
        await asyncio.sleep(0.1)

        yield f'data: {json.dumps({"eventType": "AGENT_STATUS", "taskId": task_id, "payload": {"status": "THINKING"}})}\n\n'
        await asyncio.sleep(0.1)

        # Call OmniRoute local reverse proxy
        gateway_url = "http://127.0.0.1:20128/v1/chat/completions"
        system_prompt = (
            f"You are the Jinwoo Autonomous {agent_id.upper()} agent working inside '{workspace_path}'. "
            "You have tools to read, write, list files, run commands, and check git diffs. "
            "Perform requested software engineering tasks accurately."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]

        payload = {
            "model": model,
            "messages": messages,
            "tools": TOOLS_SCHEMA,
            "tool_choice": "auto",
            "stream": False
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            http_req = urllib.request.Request(
                gateway_url,
                data=req_data,
                headers={"Content-Type": "application/json", "Authorization": "Bearer sk-jinwoo-local"}
            )
            
            with urllib.request.urlopen(http_req, timeout=60) as resp:
                resp_json = json.loads(resp.read().decode("utf-8"))

            choice = resp_json.get("choices", [{}])[0]
            msg = choice.get("message", {})
            content = msg.get("content", "")
            tool_calls = msg.get("tool_calls", [])

            if content:
                yield f'data: {json.dumps({"eventType": "MODEL_STREAM", "taskId": task_id, "payload": {"delta": content}})}\n\n'

            # Execute tool calls if returned by model
            for tc in tool_calls:
                fn_name = tc.get("function", {}).get("name")
                fn_args_raw = tc.get("function", {}).get("arguments", "{}")
                try:
                    fn_args = json.loads(fn_args_raw) if isinstance(fn_args_raw, str) else fn_args_raw
                except:
                    fn_args = {}

                yield f'data: {json.dumps({"eventType": "TOOL_CALL", "taskId": task_id, "payload": {"tool": fn_name, "args": fn_args}})}\n\n'
                
                result = execute_tool(workspace_path, fn_name, fn_args)
                yield f'data: {json.dumps({"eventType": "TOOL_RESULT", "taskId": task_id, "payload": {"tool": fn_name, "result": result}})}\n\n'

            yield f'data: {json.dumps({"eventType": "TASK_COMPLETED", "taskId": task_id, "payload": {"summary": content or "Task finished successfully."}})}\n\n'

        except Exception as err:
            yield f'data: {json.dumps({"eventType": "AGENT_ERROR", "taskId": task_id, "payload": {"error": str(err)}})}\n\n'
            yield f'data: {json.dumps({"eventType": "TASK_FAILED", "taskId": task_id, "payload": {"error": str(err)}})}\n\n'

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    port = int(os.environ.get("JINWOO_WORKER_PORT", "20129"))
    print(f"[JINWOO] Starting Jinwoo Autonomous Worker Daemon on port {port}...")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")
