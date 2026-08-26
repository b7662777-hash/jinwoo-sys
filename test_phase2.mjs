import fs from 'fs';
import path from 'path';

const PROJECT_DIR = "r:/Jinwoo Sys/OmniRoute-release-v3.8.51/.sandbox/phase2_test";

async function executeAgent(role, prompt, workspacePath, history = []) {
    console.log(`\n[SPAWNING AGENT: ${role.toUpperCase()}]`);
    console.log(`Prompt: ${prompt.substring(0, 80)}...`);
    
    // Simulate Router (Phase 2.3)
    let model = "gpt-4o";
    let provider = "openai";
    if (role === "qa") {
        model = "llama3";
        provider = "ollama";
    }

    console.log(`[ROUTER] Selected provider: ${provider}, model: ${model} for role: ${role}`);

    const res = await fetch("http://127.0.0.1:20128/api/jinwoo/bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            taskId: `task_${role}_1`,
            workflowId: "workflow_p2",
            agentId: role,
            prompt: prompt,
            workspacePath: workspacePath
        })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    
    let handoffEvent = null;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        
        for (const line of lines) {
            const data = JSON.parse(line.replace('data: ', ''));
            
            if (data.eventType === 'MODEL_STREAM' && data.payload.delta) {
                process.stdout.write(data.payload.delta);
            } else if (data.eventType === 'TOOL_CALL') {
                console.log(`\n[TOOL CALL] ${role} executing ${data.payload.tool}...`);
                if (data.payload.tool === "agent_handoff") {
                    handoffEvent = typeof data.payload.args === 'string' ? JSON.parse(data.payload.args) : data.payload.args;
                }
            } else if (data.eventType === 'TOOL_RESULT') {
                console.log(`[TOOL RESULT] ${data.payload.tool} completed. Result: ${data.payload.result?.substring(0, 100)}...`);
            }
        }
    }
    
    console.log(`\n[AGENT ${role.toUpperCase()} COMPLETED]`);
    return handoffEvent;
}

async function run() {
    console.log("=== JINWOO SYS PHASE 2 VERTICAL SLICE ===");
    
    if (!fs.existsSync(PROJECT_DIR)) {
        fs.mkdirSync(PROJECT_DIR, { recursive: true });
    }
    
    // Create an initial file for them to work on
    fs.writeFileSync(path.join(PROJECT_DIR, "index.js"), "// Initial entry point\n");

    let currentRole = "architect";
    let currentPrompt = "We need to add a simple authentication module to this project. Create auth.js with a login function. Then handoff to 'developer' to implement it.";
    
    let iterations = 0;
    while (currentRole && iterations < 3) {
        iterations++;
        const handoff = await executeAgent(currentRole, currentPrompt, PROJECT_DIR);
        
        if (handoff && handoff.to_agent) {
            console.log(`\n>>> COLLABORATION EVENT: ${handoff.message_type} -> ${handoff.to_agent}`);
            console.log(`>>> MESSAGE: ${handoff.message}`);
            
            currentRole = handoff.to_agent;
            currentPrompt = `You have received a task from the previous agent. Message: ${handoff.message}. Context files: ${handoff.context_files?.join(', ')}. Please execute it. If you are the developer, implement it and handoff to 'qa'. If you are qa, verify it.`;
        } else {
            console.log("\n>>> NO HANDOFF. WORKFLOW COMPLETE.");
            break;
        }
    }
    
    console.log("\n[VERIFYING SHARED WORKSPACE]");
    const files = fs.readdirSync(PROJECT_DIR);
    console.log("Files in project:", files);
    if (files.includes("auth.js")) {
        console.log("SUCCESS: auth.js was created and shared among agents!");
    }
}

run().catch(console.error);
