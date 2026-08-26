import { NextRequest, NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const workflowId = url.searchParams.get("id");
  if (!workflowId) return NextResponse.json({ error: "Missing workflow ID" }, { status: 400 });
  
  try {
    const db = getJinwooDb();
    const wf = db.prepare(`SELECT * FROM workflows WHERE id = ?`).get(workflowId) as any;
    const tasks = db.prepare(`SELECT * FROM workflow_tasks WHERE workflowId = ?`).all(workflowId) as any[];
    const deps = db.prepare(`SELECT * FROM task_dependencies WHERE taskId IN (SELECT id FROM workflow_tasks WHERE workflowId = ?)`).all(workflowId) as any[];
    const rows = db.prepare(`SELECT eventType, payload FROM workflow_events WHERE workflowId = ? ORDER BY createdAt ASC`).all(workflowId);
    
    return NextResponse.json({ 
      workflow: wf,
      tasks,
      dependencies: deps,
      events: rows.map((r: any) => ({ eventType: r.eventType, payload: JSON.parse(r.payload) })) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { workflowId, prompt: initialPrompt, workspacePath } = await req.json();
    
    // Create workflow record if it doesn't exist
    try {
      const db = getJinwooDb();
      db.prepare(`INSERT OR IGNORE INTO projects (id, name, workspacePath) VALUES (?, ?, ?)`).run("project_auth_1", "Phase 3 Demo", workspacePath);
      db.prepare(`INSERT OR IGNORE INTO workflows (id, projectId, status) VALUES (?, ?, ?)`).run(workflowId, "project_auth_1", "active");
    } catch (e) {
      console.error("DB init error:", e);
    }

    const apiBaseUrl = `${new URL(req.url).origin}/api/v1`.replace("0.0.0.0", "127.0.0.1");

    const stream = new ReadableStream({
      async start(controller) {
        const port = process.env.JINWOO_HERMES_PORT || 20129;
        
        const saveEventToDb = (eventType: string, payload: any) => {
           try {
             getJinwooDb().prepare(`INSERT INTO workflow_events (id, workflowId, eventType, payload) VALUES (?, ?, ?, ?)`).run(
               crypto.randomUUID(), workflowId, eventType, JSON.stringify(payload)
             );
           } catch(e) {}
        };

        const sendEvent = (eventType: string, payload: any) => {
          saveEventToDb(eventType, payload);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ eventType, payload })}\n\n`));
        };

        const db = getJinwooDb();
        const tasks = db.prepare(`SELECT * FROM workflow_tasks WHERE workflowId = ?`).all(workflowId) as any[];
        
        let lockedFiles = new Map<string, string>();

        if (tasks.length > 0) {
          // DAG Execution Mode
          const dependencies = db.prepare(`SELECT * FROM task_dependencies WHERE taskId IN (SELECT id FROM workflow_tasks WHERE workflowId = ?)`).all(workflowId) as any[];
          
          const taskGraph = new Map<string, any>();
          tasks.forEach(t => taskGraph.set(t.id, { ...t, dependsOn: [], dependents: [] }));
          
          dependencies.forEach(d => {
             if (taskGraph.has(d.taskId)) {
               taskGraph.get(d.taskId).dependsOn.push(d.dependsOnTaskId);
             }
             if (taskGraph.has(d.dependsOnTaskId)) {
                taskGraph.get(d.dependsOnTaskId).dependents.push(d.taskId);
             }
          });

          let activeTaskPromises = new Set<Promise<void>>();
          let totalTokens = 0;
          const MAX_BUDGET = 50000;

          const { CodingAgentManager } = await import("@/lib/jinwoo/coding-agents/manager");
          const agentManager = CodingAgentManager.getInstance();

          const executeTask = async (taskId: string, previousContext: string = "") => {
             const task = taskGraph.get(taskId);
             
             if (totalTokens > MAX_BUDGET) {
                 sendEvent("RESOURCE_LIMIT_REACHED", { limit: MAX_BUDGET, current: totalTokens, task: task.id });
                 task.status = "FAILED";
                 db.prepare('UPDATE workflow_tasks SET status = ? WHERE id = ?').run('FAILED', task.id);
                 return;
             }
             
             sendEvent("ORCHESTRATOR_STATE", { status: `Starting task ${task.id}`, role: task.role });
             
             sendEvent("AGENT_CONFIG", { 
               agentId: task.role, 
               model: task.model, 
               provider: task.provider, 
               gateway: "OmniRoute",
               routingReason: "Assigned by Plan", 
               isLocal: false 
             });

             const prompt = `Objective: ${task.objective}\n\nIMPORTANT: When you have completed your task, write a brief summary of what you did and any instructions/details for downstream agents.`;
             let agentOutput = "";

             // Determine assigned coding agent for role
             let assignedAgent = "hermes";
             try {
               const roleRow = db.prepare("SELECT * FROM role_assignments WHERE role = ? LIMIT 1").get(task.role.toLowerCase()) as any;
               if (roleRow?.codingAgent) {
                 assignedAgent = roleRow.codingAgent;
               }
             } catch(e) {}

             try {
               await agentManager.executeTask({
                 sessionId: `sess_${task.id}_${Date.now()}`,
                 agentId: task.role,
                 role: task.role,
                 workflowId,
                 taskId: task.id,
                 workspacePath,
                 model: task.model,
                 provider: task.provider,
                 apiBaseUrl,
                 prompt,
                 upstreamContext: previousContext,
                 runtimeId: assignedAgent
               } as any, (event) => {
                 if (event.eventType === "MODEL_STREAM" && event.payload?.delta) {
                   agentOutput += event.payload.delta;
                 }

                 if (event.eventType === "USAGE_UPDATED" && event.payload?.usage) {
                   const u = event.payload.usage;
                   const t = u.total_tokens || ((u.prompt_tokens || 0) + (u.completion_tokens || 0));
                   totalTokens += t;
                 }

                 sendEvent(event.eventType, event.payload);
               });
             } catch (execErr: any) {
               sendEvent("ORCHESTRATOR_ERROR", { error: `Execution error for ${task.role}: ${execErr.message}` });
             }

             task.status = 'COMPLETED';
             task.output = agentOutput;
             db.prepare('UPDATE workflow_tasks SET status = ? WHERE id = ?').run('COMPLETED', task.id);

             for (const depId of task.dependents) {
                const depTask = taskGraph.get(depId);
                if (depTask.status === 'PENDING') {
                   const allMet = depTask.dependsOn.every((dep: string) => taskGraph.get(dep).status === 'COMPLETED');
                   if (allMet) {
                      depTask.status = 'RUNNING';
                      
                      const upstreamMsgs = depTask.dependsOn.map((dep: string) => `Message from ${taskGraph.get(dep).role}:\n${taskGraph.get(dep).output || 'No output'}`).join('\n\n');
                      
                      sendEvent("AGENT_MESSAGE", {
                         fromAgent: task.role,
                         toAgent: depTask.role,
                         workflowId: workflowId,
                         taskId: task.id,
                         correlationId: crypto.randomUUID(),
                         message: task.output || 'Task completed.',
                         reason: `Dependencies fulfilled from upstream task ${task.id}.`
                      });
                      
                      sendEvent("ORCHESTRATOR_HANDOFF", {
                         from: task.role,
                         to: depTask.role,
                         message: `Dependencies fulfilled from upstream task ${task.id}.`,
                         correlationId: crypto.randomUUID(),
                         providerId: task.provider,
                         modelId: task.model,
                         taskId: depTask.id
                      });
                      const p = executeTask(depTask.id, upstreamMsgs);
                      activeTaskPromises.add(p);
                      p.finally(() => activeTaskPromises.delete(p));
                   }
                }
             }
          };

          for (const [taskId, task] of taskGraph.entries()) {
            if (task.dependsOn.length === 0 && task.status === 'PENDING') {
               task.status = 'RUNNING';
               const p = executeTask(taskId);
               activeTaskPromises.add(p);
               p.finally(() => activeTaskPromises.delete(p));
            }
          }

          while (activeTaskPromises.size > 0) {
             await Promise.race(Array.from(activeTaskPromises));
          }

          sendEvent("ORCHESTRATOR_COMPLETE", { status: "Workflow finished" });
          controller.close();
          return;
        }

        // --- FALLBACK SEQUENTIAL MODE FOR RAW REQUESTS (NO DAG) ---
        let activePromises = new Set<Promise<void>>();
        let iterations = 0;
        
        async function spawnAgentTask(currentRole: string, currentPrompt: string) {
          iterations++;
          const currentIteration = iterations;
          
          let activeModelId = "gpt-4o";
          let activeProvider = "openai";

          try {
            const tr = getJinwooDb().prepare(`SELECT * FROM role_assignments WHERE role = ? LIMIT 1`).get(currentRole.toLowerCase()) as any;
            if (tr) {
              activeModelId = tr.model;
              activeProvider = tr.provider;
            }
          } catch(e) {}

          const configEvent = { eventType: "AGENT_CONFIG", payload: { agentId: currentRole, model: activeModelId, provider: activeProvider, isLocal: false, routingReason: "Assigned by User Policy" }};
          sendEvent("ORCHESTRATOR_STATE", { status: `Spawning ${currentRole}`, role: currentRole });
          sendEvent(configEvent.eventType, configEvent.payload);

          const dispatchRes = await fetch(`http://127.0.0.1:${port}/bus/dispatch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId: `${workflowId}_${currentRole}_${currentIteration}`,
              workflowId,
              agentId: currentRole,
              prompt: currentPrompt,
              workspacePath,
              model: activeModelId,
              provider: activeProvider,
              apiBaseUrl
            }),
          });

          if (!dispatchRes.body) {
             sendEvent("ORCHESTRATOR_ERROR", { error: "Failed to connect to Python Hermes Bus" });
             return;
          }

          const reader = dispatchRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const dataStr = line.slice(6);
                    if (!dataStr) continue;
                    const data = JSON.parse(dataStr);

                    let handoffEvent = null;
                    if (data.eventType === 'TOOL_CALL' && data.payload.tool === "agent_handoff") {
                      handoffEvent = typeof data.payload.args === 'string' ? JSON.parse(data.payload.args) : data.payload.args;
                    }
                    if (data.eventType === 'TOOL_CALL' && data.payload.tool === "write_file") {
                       const args = typeof data.payload.args === 'string' ? JSON.parse(data.payload.args) : (data.payload.args || {});
                       const filename = args.path || args.file || "workspace_file";
                       
                       if (lockedFiles.has(filename) && lockedFiles.get(filename) !== currentRole) {
                         sendEvent("CONFLICT_DETECTED", { path: filename, agent1: lockedFiles.get(filename), agent2: currentRole });
                         continue;
                       }
                       lockedFiles.set(filename, currentRole);

                       const changeEv = { eventType: "FILE_CHANGED", payload: { path: filename, agentId: currentRole, changeType: "MODIFIED", timestamp: new Date().toISOString() } };
                       sendEvent(changeEv.eventType, changeEv.payload);
                    }
                    if (data.usage || data.payload?.usage) {
                      const usage = data.usage || data.payload.usage;
                      const usageSource = data.payload?.source || data.source || "PROVIDER_REPORTED";
                      sendEvent("USAGE_UPDATED", {
                        agentId: currentRole,
                        model: activeModelId,
                        provider: activeProvider,
                        usage,
                        source: usageSource
                      });
                    }

                    if (data.eventType !== "USAGE_UPDATED" && data.eventType !== "FILE_CHANGED") {
                       controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                    }

                    if (handoffEvent) {
                       const targets = handoffEvent.to_agent.split(',').map((s: string) => s.trim());
                       for (const target of targets) {
                          sendEvent("ORCHESTRATOR_HANDOFF", { 
                            from: currentRole, 
                            to: target,
                            message: handoffEvent.message,
                            correlationId: crypto.randomUUID(),
                            providerId: activeProvider,
                            modelId: activeModelId,
                            taskId: `${workflowId}_${currentRole}_${currentIteration}`
                          });
                          
                          const nextPrompt = `You have received a task from the previous agent. Message: ${handoffEvent.message}. Context files: ${handoffEvent.context_files?.join(', ')}. Please execute it.`;
                          const p = spawnAgentTask(target, nextPrompt);
                          activePromises.add(p);
                          p.finally(() => activePromises.delete(p));
                       }
                    }
                  } catch (err) {}
                }
              }
            }
          } catch (e) {}
        }

        const initialPromise = spawnAgentTask("architect", initialPrompt);
        activePromises.add(initialPromise);
        initialPromise.finally(() => activePromises.delete(initialPromise));

        while (activePromises.size > 0) {
           await Promise.race(Array.from(activePromises));
        }

        sendEvent("ORCHESTRATOR_COMPLETE", { status: "Workflow finished" });
        controller.close();
      }
    });

    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
