import { GitMcpServer } from "../mcp/gitMcpServer.js";
import { A2AMessageBus } from "../protocol/a2a.js";
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

    // A2A Bus kaydı
    this.bus.register(this.securityAgent.card);
    this.bus.register(this.qualityAgent.card);
    this.bus.register(this.contextAgent.card);
  }

  async runInspection(options = { staged: false }) {
    console.log("\n🚀 [GRAPH ENGINE] Inspection started...");

    // Step 1: MCP üzerinden Git Diff verisini al
    const diff = await this.mcpServer.executeTool("get_git_diff", { staged: options.staged });
    
    if (diff === "Herhangi bir Git değişikliği bulunamadı.") {
      return { status: "EMPTY", message: "İncelenecek Git değişikliği yok." };
    }

    // Step 2: Subagent'ları paralel olarak çalıştır (A2A Dispatch)
    console.log("🔄 [GRAPH ENGINE] Subagents analyzing diff...");
    const [secReport, qualReport, ctxReport] = await Promise.all([
      this.securityAgent.analyze(diff),
      this.qualityAgent.analyze(diff),
      this.contextAgent.analyze(diff)
    ]);

    // Step 3: Harness Evaluator ile nihai kararı ver
    const decision = this.evaluator.evaluate(secReport, qualReport);

    return {
      timestamp: new Date().toISOString(),
      decision,
      reports: {
        security: secReport,
        quality: qualReport,
        context: ctxReport
      }
    };
  }
}