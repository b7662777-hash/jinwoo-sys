import { NextRequest, NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getProviderConnections } from "@/lib/db/providers";
import { PROVIDER_MODELS } from "@/shared/constants/models";
import { buildAliasMaps } from "@/app/api/v1/models/catalogProviderMaps";

function getMinimalContext(workspacePath: string) {
  try {
    let context = "";
    if (workspacePath && fs.existsSync(workspacePath)) {
      const files = fs.readdirSync(workspacePath);
      context += `Project Directory Contents: ${files.slice(0, 30).join(", ")}\n`;
      
      const pkgPath = path.join(workspacePath, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        context += `Package Name: ${pkg.name}\nDependencies: ${Object.keys(pkg.dependencies || {}).slice(0, 20).join(", ")}\n`;
      }
    } else {
      context = "No specific workspace files found or empty directory.\n";
    }
    return context;
  } catch (e) {
    return "Context unavailable\n";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, workspacePath: rawWorkspacePath, workflowId, roleCount = "auto", customRoles = [] } = body;
    
    if (!prompt || !workflowId) {
      return NextResponse.json({ 
        success: false, 
        error: "Prompt and Workflow ID are required.", 
        status: "PLANNING_FAILED" 
      }, { status: 400 });
    }

    const db = getJinwooDb();
    
    // Resolve workspace path
    let workspacePath = rawWorkspacePath;
    if (!workspacePath || workspacePath === "undefined") {
      try {
        const proj = db.prepare("SELECT workspacePath FROM projects ORDER BY createdAt DESC LIMIT 1").get() as any;
        if (proj?.workspacePath) {
          workspacePath = proj.workspacePath;
        }
      } catch (e) {}
    }
    
    if (!workspacePath) {
      workspacePath = process.cwd();
    }

    // Discover real connected models from OmniRoute (including OpenRouter and dynamic providers)
    const connections = await getProviderConnections();
    const { aliasToProviderId } = buildAliasMaps();
    
    const availableModels: any[] = [];
    const seenModelIds = new Set<string>();
    
    for (const c of connections) {
        const isActive = c.isActive === true || c.isActive === 1;
        const testStatus = (c.testStatus || "").toLowerCase();
        const isHealthy = testStatus === "success" || testStatus === "active" || testStatus === "unknown" || !c.lastError;
        
        if (isActive && isHealthy) {
            const canonicalId = aliasToProviderId[c.provider] || c.provider;
            
            // Check dynamic synced models (e.g. OpenRouter)
            try {
              const { getSyncedAvailableModelsForConnection } = await import("@/lib/db/models");
              const synced = await getSyncedAvailableModelsForConnection(c.id);
              if (synced && synced.length > 0) {
                for (const sm of synced) {
                  const fullId = sm.id.includes("/") ? sm.id : `${canonicalId}/${sm.id}`;
                  if (!seenModelIds.has(fullId)) {
                    seenModelIds.add(fullId);
                    availableModels.push({
                      id: fullId,
                      gateway: "OmniRoute",
                      provider: canonicalId,
                      name: sm.name || sm.id,
                      context_length: sm.context_length || 128000
                    });
                  }
                }
              }
            } catch(e) {}

            // Check static catalog models
            const modelsForProvider = PROVIDER_MODELS[canonicalId] || PROVIDER_MODELS[c.provider] || [];
            if (modelsForProvider.length > 0) {
                modelsForProvider.forEach((m: any) => {
                    const fullId = `${canonicalId}/${m.id}`;
                    if (!seenModelIds.has(fullId)) {
                      seenModelIds.add(fullId);
                      availableModels.push({
                          id: fullId,
                          gateway: "OmniRoute",
                          provider: canonicalId,
                          name: m.name,
                          context_length: m.context_length || 128000
                      });
                    }
                });
            } else if (!seenModelIds.has(`${canonicalId}/default-model`)) {
                const fullId = `${canonicalId}/default-model`;
                seenModelIds.add(fullId);
                availableModels.push({
                    id: fullId,
                    gateway: "OmniRoute",
                    provider: canonicalId,
                    name: `${c.provider} Default Model`,
                    context_length: 128000
                });
            }
        }
    }

    // Determine planner model to use
    let plannerModel = "gpt-4o";
    let plannerProvider = "openai";

    const goodPlannerModel = availableModels.find(m => 
      m.id.includes("gpt-4") || 
      m.id.includes("claude") || 
      m.id.includes("gemini") || 
      m.id.includes("sonnet")
    );
    
    if (goodPlannerModel) {
       plannerModel = goodPlannerModel.id;
       plannerProvider = goodPlannerModel.provider;
    } else if (availableModels.length > 0) {
       plannerModel = availableModels[0].id;
       plannerProvider = availableModels[0].provider;
    }

    try {
      const roleRow = db.prepare(`SELECT * FROM role_assignments WHERE role = 'planner' LIMIT 1`).get() as any;
      if (roleRow) {
        plannerModel = roleRow.model;
        plannerProvider = roleRow.provider;
      }
    } catch(e) {}

    const projectContext = getMinimalContext(workspacePath);

    let roleConstraint = "";
    if (typeof roleCount === "number" && roleCount > 0) {
      roleConstraint = `You must decompose this into EXACTLY ${roleCount} distinct specialist roles.`;
    } else {
      roleConstraint = `Select the MINIMUM number of specialist roles needed (typically 1 to 4 agents). Do NOT over-allocate agents if not required.`;
    }

    const systemPrompt = `You are Jinwoo Planner, an expert multi-agent workforce orchestrator.
Your job is to analyze the user's request and project context to generate a structured Workflow Plan.

Available connected models:
${JSON.stringify(availableModels, null, 2)}

Rules:
1. ${roleConstraint}
2. Decompose the user request into logical tasks with clear dependencies. Independent tasks should have empty dependsOn arrays so they can run in parallel. Dependent tasks must reference predecessor task IDs.
3. Recommend the BEST available model for each task from the available list above based on reasoning, coding, and context capabilities.
4. If no connected model satisfies a role, set "recommendedModel": null and "reason": "No connected model currently satisfies this role."
5. Output ONLY valid JSON matching this schema with NO markdown codeblocks:
{
  "enhancedRequest": {
    "objective": "string summary",
    "requirements": ["string"],
    "constraints": ["string"],
    "risks": ["string"],
    "testing": ["string"]
  },
  "tasks": [
    {
      "id": "task_1",
      "role": "string (e.g. architect, developer, security, qa, or custom specialist)",
      "objective": "specific actionable instructions for this agent",
      "dependsOn": ["task_ids this task depends on, or empty array"],
      "recommendedModel": "exact model ID from available models list",
      "recommendedProvider": "exact provider ID",
      "reason": "Why this model was chosen for this role"
    }
  ]
}`;

    let plan: any = null;
    const nextOrigin = new URL(req.url).origin.replace("0.0.0.0", "127.0.0.1");

    try {
      // Call OmniRouter LLM
      const res = await fetch(`${nextOrigin}/api/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer local" },
        body: JSON.stringify({
          model: plannerModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Context:\n${projectContext}\n\nPrompt:\n${prompt}` }
          ]
        })
      });

      if (res.ok) {
        const llmResult = await res.json();
        let rawContent = llmResult.choices?.[0]?.message?.content || "";
        if (rawContent.startsWith("```json")) rawContent = rawContent.substring(7);
        if (rawContent.startsWith("```")) rawContent = rawContent.substring(3);
        if (rawContent.endsWith("```")) rawContent = rawContent.substring(0, rawContent.length - 3);
        
        plan = JSON.parse(rawContent.trim());
      }
    } catch (llmErr) {
      console.warn("Planner LLM call failed, generating deterministic fallback plan:", llmErr);
    }

    // Robust Fallback if LLM call or JSON parse failed
    if (!plan || !plan.tasks || !Array.isArray(plan.tasks) || plan.tasks.length === 0) {
      const defaultModel = availableModels[0]?.id || "gpt-4o";
      const defaultProvider = availableModels[0]?.provider || "openai";
      const codingModel = availableModels.find(m => m.id.includes("claude") || m.id.includes("sonnet") || m.id.includes("gpt-4"))?.id || defaultModel;
      const codingProvider = availableModels.find(m => m.id.includes("claude") || m.id.includes("sonnet") || m.id.includes("gpt-4"))?.provider || defaultProvider;

      const targetCount = typeof roleCount === "number" && roleCount > 0 ? roleCount : 3;

      const fallbackTasks: any[] = [];
      
      if (targetCount === 1) {
        fallbackTasks.push({
          id: "task_1",
          role: "developer",
          objective: `Implement changes in the workspace for: ${prompt}`,
          dependsOn: [],
          recommendedModel: codingModel,
          recommendedProvider: codingProvider,
          reason: "Direct implementation of requested changes."
        });
      } else if (targetCount === 2) {
        fallbackTasks.push({
          id: "task_1",
          role: "developer",
          objective: `Implement features and updates for: ${prompt}`,
          dependsOn: [],
          recommendedModel: codingModel,
          recommendedProvider: codingProvider,
          reason: "Primary implementation agent."
        });
        fallbackTasks.push({
          id: "task_2",
          role: "qa",
          objective: `Validate and verify code quality, run tests, and check edge cases for the implemented changes.`,
          dependsOn: ["task_1"],
          recommendedModel: defaultModel,
          recommendedProvider: defaultProvider,
          reason: "Quality assurance and testing validation."
        });
      } else {
        fallbackTasks.push({
          id: "task_1",
          role: "architect",
          objective: `Analyze project workspace and create implementation specifications for: ${prompt}`,
          dependsOn: [],
          recommendedModel: defaultModel,
          recommendedProvider: defaultProvider,
          reason: "High reasoning capability for architecture design."
        });
        fallbackTasks.push({
          id: "task_2",
          role: "developer",
          objective: `Implement the components, endpoints, and file modifications based on the architectural plan.`,
          dependsOn: ["task_1"],
          recommendedModel: codingModel,
          recommendedProvider: codingProvider,
          reason: "Optimized for code generation and repository editing."
        });
        fallbackTasks.push({
          id: "task_3",
          role: "qa",
          objective: `Execute test verification, check error cases, and ensure robustness across all changed files.`,
          dependsOn: ["task_2"],
          recommendedModel: defaultModel,
          recommendedProvider: defaultProvider,
          reason: "Validation and testing review."
        });
        
        // Add extra custom roles if user requested > 3
        for (let i = 4; i <= targetCount; i++) {
          fallbackTasks.push({
            id: `task_${i}`,
            role: `specialist_${i}`,
            objective: `Perform specialized review and verification for step ${i}.`,
            dependsOn: [`task_${i - 1}`],
            recommendedModel: defaultModel,
            recommendedProvider: defaultProvider,
            reason: "Specialized analysis."
          });
        }
      }

      plan = {
        enhancedRequest: {
          objective: prompt,
          requirements: ["Implement requested functionality cleanly", "Preserve existing workspace integrity", "Verify changes thoroughly"],
          constraints: ["Operate within selected workspace directory", "Ensure error-free execution"],
          risks: ["Workspace file overwrites without approval"],
          testing: ["Run automated unit verification and inspect modified files"]
        },
        tasks: fallbackTasks
      };
    }

    // Ensure default project exists for tests/fallbacks
    db.prepare(`INSERT OR IGNORE INTO projects (id, name, workspacePath) VALUES (?, ?, ?)`).run('project_auth_1', 'Default Project', workspacePath);

    // Save plan to DB
    const insertWorkflow = db.prepare(`
      INSERT OR REPLACE INTO workflows (id, projectId, status, originalPrompt, enhancedPrompt)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertWorkflow.run(workflowId, 'project_auth_1', 'APPROVAL_REQUIRED', prompt, JSON.stringify(plan.enhancedRequest));

    // Clear old tasks if re-planning
    db.prepare('DELETE FROM task_dependencies WHERE taskId IN (SELECT id FROM workflow_tasks WHERE workflowId = ?)').run(workflowId);
    db.prepare('DELETE FROM workflow_tasks WHERE workflowId = ?').run(workflowId);

    const insertTask = db.prepare(`
      INSERT OR REPLACE INTO workflow_tasks (id, workflowId, role, model, provider, objective, status)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
    `);
    
    const insertDep = db.prepare(`
      INSERT OR REPLACE INTO task_dependencies (taskId, dependsOnTaskId)
      VALUES (?, ?)
    `);

    // Pass 1: Insert all tasks
    const validTaskIds = new Set<string>();
    for (let i = 0; i < plan.tasks.length; i++) {
      const task = plan.tasks[i];
      const rawId = task.id || `task_${i + 1}`;
      const dbTaskId = `${workflowId}_${rawId}`;
      validTaskIds.add(dbTaskId);

      let taskModel = task.recommendedModel || "gpt-4o";
      let taskProvider = task.recommendedProvider || "openai";
      
      // Override with global user role assignments if they exist
      try {
        const tr = db.prepare(`SELECT * FROM role_assignments WHERE role = ? LIMIT 1`).get(task.role.toLowerCase()) as any;
        if (tr) { taskModel = tr.model; taskProvider = tr.provider; }
      } catch(e) {}

      insertTask.run(dbTaskId, workflowId, task.role, taskModel, taskProvider, task.objective);
    }

    // Pass 2: Insert dependencies only after all tasks exist in DB
    for (let i = 0; i < plan.tasks.length; i++) {
      const task = plan.tasks[i];
      const rawId = task.id || `task_${i + 1}`;
      const dbTaskId = `${workflowId}_${rawId}`;

      if (task.dependsOn && Array.isArray(task.dependsOn)) {
        for (const dep of task.dependsOn) {
          const dbDepId = `${workflowId}_${dep}`;
          if (validTaskIds.has(dbDepId)) {
            insertDep.run(dbTaskId, dbDepId);
          }
        }
      }
    }

    // Persist event in DB for refresh recovery
    db.prepare(`
      INSERT INTO workflow_events (id, workflowId, eventType, payload)
      VALUES (?, ?, ?, ?)
    `).run(crypto.randomUUID(), workflowId, 'APPROVAL_REQUIRED', JSON.stringify(plan));

    return NextResponse.json({
      success: true,
      workflowId,
      plan,
      status: 'APPROVAL_REQUIRED'
    });

  } catch (err: any) {
    console.error("Planner error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Failed to generate workflow plan", 
      status: "PLANNING_FAILED" 
    }, { status: 500 });
  }
}
