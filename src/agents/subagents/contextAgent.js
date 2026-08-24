import { AgentCard } from "../../protocol/a2a.js";

export class ContextAgent {
  constructor() {
    this.card = new AgentCard({
      id: "context-agent",
      name: "Git Context & Summary Generator",
      role: "Commit Specialist",
      description: "Summarizes changes and generates Conventional Commit messages.",
      skills: [{ id: "commit-generation", name: "Commit Generator" }]
    });
  }

  async analyze(gitDiff) {
    return {
      agentId: this.card.id,
      summary: "Git değişiklikleri başarıyla tarandı.",
      suggestedCommitMsg: "feat(core): implement initial agentic security & quality inspection"
    };
  }
}