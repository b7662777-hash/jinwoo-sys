from aiohttp import web
import json
import asyncio
import time
import os

async def handle_chat(request):
    body = await request.json()
    model = body.get("model", "unknown")
    messages = body.get("messages", [])
    
    # Extract the latest user message
    last_msg = ""
    for m in reversed(messages):
        if m["role"] == "user":
            content = m["content"]
            if isinstance(content, list):
                for part in content:
                    if part.get("type") == "text":
                        last_msg += part.get("text", "")
            else:
                last_msg = str(content)
            break
    has_tool_result = any(m.get("role") == "tool" for m in messages)
            
    print(f"\n[MOCK LLM] Request for {model}")
    print(f"[MOCK LLM] Message snippet: {last_msg[:100]}...")
    
    # We will fake the tool calls based on keywords in the prompt.
    tool_calls = []
    
    if has_tool_result:
        # We already executed tools. Just return a final thought and stop.
        pass
    elif "review and improve the authentication system" in last_msg.lower() or "architect" in last_msg.lower():
        # Architect hands off to Developer, Security, and Researcher in parallel
        tool_calls = [{
            "id": "call_architect",
            "type": "function",
            "function": {
                "name": "agent_handoff",
                "arguments": json.dumps({
                    "to_agent": "developer,security,researcher", 
                    "message_type": "AGENT_HANDOFF",
                    "message": "Please implement the auth module, analyze it concurrently, and research standard practices.",
                    "context_files": ["auth.js"]
                })
            }
        }]
    elif "developer" in messages[0].get("content", "").lower():
        await asyncio.sleep(2)
        tool_calls = [
            {
                "id": "call_write",
                "type": "function",
                "function": {
                    "name": "write_file",
                    "arguments": json.dumps({"file": "auth.js", "content": "function login() {}"})
                }
            },
            {
                "id": "call_handoff_qa",
                "type": "function",
                "function": {
                    "name": "agent_handoff",
                    "arguments": json.dumps({
                        "to_agent": "qa",
                        "message_type": "AGENT_HANDOFF",
                        "message": "Auth implementation is done, please test it."
                    })
                }
            }
        ]
    elif "security" in messages[0].get("content", "").lower():
        await asyncio.sleep(3)
        tool_calls = [
            {
                "id": "call_msg_developer",
                "type": "function",
                "function": {
                    "name": "agent_handoff",
                    "arguments": json.dumps({
                        "to_agent": "developer",
                        "message_type": "AGENT_MESSAGE",
                        "message": "I inspected auth.js. Refresh tokens are missing."
                    })
                }
            }
        ]
    elif "researcher" in messages[0].get("content", "").lower():
        await asyncio.sleep(4)
        tool_calls = [
            {
                "id": "call_researcher",
                "type": "function",
                "function": {
                    "name": "agent_handoff",
                    "arguments": json.dumps({
                        "to_agent": "architect",
                        "message_type": "AGENT_MESSAGE",
                        "message": "Research shows OAuth 2.1 is recommended for this setup."
                    })
                }
            }
        ]
    elif "qa" in messages[0].get("content", "").lower():
        pass

    response = web.StreamResponse(headers={
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache"
    })
    await response.prepare(request)
    
    # 1. Start Role
    chunk = {
        "id": "chatcmpl-mock",
        "object": "chat.completion.chunk",
        "created": int(time.time()),
        "model": model,
        "choices": [{"index": 0, "delta": {"role": "assistant"}, "finish_reason": None}]
    }
    await response.write(f"data: {json.dumps(chunk)}\n\n".encode("utf-8"))
    await asyncio.sleep(0.05)

    # 2. Text delta (only when NOT calling tools — real OpenAI behavior)
    if not tool_calls:
        chunk = {
            "id": "chatcmpl-mock",
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": model,
            "choices": [{"index": 0, "delta": {"content": "Thinking about this task... "}, "finish_reason": None}]
        }
        await response.write(f"data: {json.dumps(chunk)}\n\n".encode("utf-8"))
        await asyncio.sleep(0.05)
    
    # 3. Tool calls
    if tool_calls:
        for index, tc in enumerate(tool_calls):
            chunk = {
                "id": "chatcmpl-mock",
                "object": "chat.completion.chunk",
                "created": int(time.time()),
                "model": model,
                "choices": [{
                    "index": 0,
                    "delta": {
                        "tool_calls": [{
                            "index": index,
                            "id": tc["id"],
                            "type": "function",
                            "function": {
                                "name": tc["function"]["name"],
                                "arguments": tc["function"]["arguments"]
                            }
                        }]
                    },
                    "finish_reason": None
                }]
            }
            await response.write(f"data: {json.dumps(chunk)}\n\n".encode("utf-8"))
            await asyncio.sleep(0.05)

    # 4. Finish
    chunk = {
        "id": "chatcmpl-mock",
        "object": "chat.completion.chunk",
        "created": int(time.time()),
        "model": model,
        "choices": [{"index": 0, "delta": {}, "finish_reason": "tool_calls" if tool_calls else "stop"}],
        "usage": {"prompt_tokens": 120, "completion_tokens": 45, "total_tokens": 165}
    }
    await response.write(f"data: {json.dumps(chunk)}\n\n".encode("utf-8"))
    
    await response.write(b"data: [DONE]\n\n")
    return response

app = web.Application()
app.router.add_post("/v1/chat/completions", handle_chat)

if __name__ == "__main__":
    print("Mock LLM for Phase 2 running on 20130...")
    web.run_app(app, host="127.0.0.1", port=20130)
