import asyncio
import httpx
import os
import shutil

async def run_task(task_id, workspace, target_file):
    print(f"[{task_id}] Starting in workspace {workspace}")
    
    # Send request to jinwoo_bus
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream(
            "POST", 
            "http://127.0.0.1:20129/bus/dispatch", 
            json={
                "taskId": task_id,
                "workflowId": "test_wf",
                "agentId": "developer",
                "prompt": f"Write the exact word 'SUCCESS_{task_id}' into a file named '{target_file}'. Do not use absolute paths. Just use '{target_file}' directly so it uses the current workspace.",
                "workspacePath": workspace,
                "model": "gpt-4o",
                "provider": "openai"
            }
        ) as response:
            async for chunk in response.aiter_text():
                pass # Consume stream
    print(f"[{task_id}] Finished.")

async def main():
    w1 = "r:/Jinwoo Sys/workspace_a"
    w2 = "r:/Jinwoo Sys/workspace_b"
    os.makedirs(w1, exist_ok=True)
    os.makedirs(w2, exist_ok=True)
    
    await asyncio.gather(
        run_task("task_A", w1, "file_a.txt"),
        run_task("task_B", w2, "file_b.txt")
    )

    # Check results
    res_a = os.path.exists(os.path.join(w1, "file_a.txt"))
    res_b = os.path.exists(os.path.join(w2, "file_b.txt"))
    cross_a = os.path.exists(os.path.join(w1, "file_b.txt"))
    cross_b = os.path.exists(os.path.join(w2, "file_a.txt"))
    
    print("file_a in w1:", res_a)
    print("file_b in w2:", res_b)
    print("CROSS POLLINATION check (should be False):")
    print("file_b in w1:", cross_a)
    print("file_a in w2:", cross_b)

if __name__ == "__main__":
    asyncio.run(main())
