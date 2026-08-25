import { GitMcpServer } from "../mcp/gitMcpServer.js";
import { A2AMessageBus, Task } from "../protocol/a2a.js";
import { SecurityAgent } from "../agents/subagents/SecurityAgent.js";
import { QualityAgent } from "../agents/subagents/qualityAgent.js";
import { ContextAgent } from "../agents/subagents/contextAgent.js";
import { HarnessEvaluator } from "../harness/evaluator.js";

export class GraphEngine {
  constructor() {
    this.mcpServer = new GitMcpServer();
    this.bus = new A2AMessageBus();
    
    // Subagent'ları başlat
    this.securityAgent = new SecurityAgent();
    this.qualityAgent = new QualityAgent();
    this.contextAgent = new ContextAgent();
    this.evaluator = new HarnessEvaluator();

    // A2A MessageBus Santral Kaydı
    this.bus.register(this.securityAgent.card);
    this.bus.register(this.qualityAgent.card);
    this.bus.register(this.contextAgent.card);
  }

  async runInspection(options = { staged: false }) {
    console.log("\n🚀 [GRAPH ENGINE] Inspection started...");

    // Adım 1: MCP üzerinden Git Diff verisini al
    const diff = await this.mcpServer.executeTool("get_git_diff", { staged: options.staged });
    
    if (!diff || diff === "Herhangi bir Git değişikliği bulunamadı." || diff.startsWith("[MCP ERROR]")) {
      return {
        status: "EMPTY",
        message: diff?.startsWith("[MCP ERROR]")
          ? "Git deposu okunamadı. Bu klasörde `git init` yapıldığından emin olun."
          : "İncelenecek Git değişikliği yok."
      };
    }

    // Adım 2: Her bir alt ajan için A2A standart görev (Task) paketlerini oluştur
    const secTask = new Task({
      taskId: `task-sec-${Date.now()}`,
      agentId: this.securityAgent.card.id,
      inputData: { diff }
    });

    const qualTask = new Task({
      taskId: `task-qual-${Date.now()}`,
      agentId: this.qualityAgent.card.id,
      inputData: { diff }
    });

    const ctxTask = new Task({
      taskId: `task-ctx-${Date.now()}`,
      agentId: this.contextAgent.card.id,
      inputData: { diff }
    });

    // Adım 3: Subagent'ları A2A görevleriyle paralel çalıştır (Execute Task)
    console.log("🔄 [GRAPH ENGINE] Subagents analyzing diff via A2A Tasks...");
    const [completedSecTask, completedQualTask, completedCtxTask] = await Promise.all([
      this.securityAgent.executeTask(secTask, diff),
      this.qualityAgent.executeTask(qualTask, diff),
      this.contextAgent.executeTask(ctxTask, diff)
    ]);

    // Adım 4: Task'lar içindeki Artifact (çıktı) verilerini çıkar
    const secReport = completedSecTask.artifacts?.at(-1)?.data ?? {};
    const qualReport = completedQualTask.artifacts?.at(-1)?.data ?? {};
    const ctxReport = completedCtxTask.artifacts?.at(-1)?.data ?? {};

    // Adım 5: Harness Evaluator ile nihai kararı ver
    const decision = this.evaluator.evaluate(secReport, qualReport);

    return {
      timestamp: new Date().toISOString(),
      decision,
      tasks: {
        security: completedSecTask,
        quality: completedQualTask,
        context: completedCtxTask
      },
      reports: {
        security: secReport,
        quality: qualReport,
        context: ctxReport
      }
    };
  }
}