import { AgentCard } from "../../protocol/a2a.js";

export class SecurityAgent {
  constructor() {
    this.card = new AgentCard({
      id: "security-agent",
      name: "Security & Secret Scanner",
      role: "Security Specialist",
      description: "Scans code diffs for secrets, API keys, and security vulnerabilities.",
      skills: [{ id: "secret-leak-detection", name: "Secret Scanner" }]
    });
  }

  async analyze(gitDiff) {
    // Basit kural tabanlı + mock LLM analiz simülasyonu
    const issues = [];
    const lowerDiff = gitDiff.toLowerCase();

    if (lowerDiff.includes("api_key") || lowerDiff.includes("secret") || lowerDiff.includes("password")) {
      issues.push({
        severity: "CRITICAL",
        file: "Detected in diff",
        message: "Hassas veri veya API Key sızıntısı tespiti!",
        suggestion: "Lütfen hassas verileri .env dosyasına taşıyın."
      });
    }

    return {
      agentId: this.card.id,
      status: issues.length > 0 ? "FAILED" : "PASSED",
      issues
    };
  }
}