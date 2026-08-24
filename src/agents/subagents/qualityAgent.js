import { AgentCard } from "../../protocol/a2a.js";

export class QualityAgent {
  constructor() {
    this.card = new AgentCard({
      id: "quality-agent",
      name: "Code Quality & Bug Inspector",
      role: "Quality Assurance Specialist",
      description: "Inspects code quality, logic bugs, and missing error handlers.",
      skills: [{ id: "bug-detection", name: "Bug Inspector" }]
    });
  }

  async analyze(gitDiff) {
    const issues = [];

    if (gitDiff.includes("console.log")) {
      issues.push({
        severity: "LOW",
        message: "Unutulmuş console.log() tespiti.",
        suggestion: "Prodüksiyona çıkmadan önce log ifadelerini temizleyin."
      });
    }

    return {
      agentId: this.card.id,
      status: issues.some(i => i.severity === "HIGH") ? "FAILED" : "PASSED",
      issues
    };
  }
}