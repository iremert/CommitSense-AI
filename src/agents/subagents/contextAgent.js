import { AgentCard, Task, TaskStatus } from "../../protocol/a2a.js";

export class ContextAgent {
  constructor() {
    this.card = new AgentCard({
      id: "context-agent",
      name: "Git Context & Summary Generator",
      role: "Commit Specialist",
      description: "Summarizes changes and generates Conventional Commit messages dynamically.",
      skills: [
        { id: "commit-generation", name: "Commit Generator" },
        { id: "diff-summary", name: "Diff Summarizer" }
      ]
    });
  }

  /**
   * A2A Standardına Uygun Görev Çalıştırma Metodu
   * @param {Task} task - A2A Görev Nesnesi
   * @param {string} gitDiff - İnceleme yapılacak git diff metni
   */
  async executeTask(task, gitDiff) {
    task.markWorking();

    try {
      // 1. Eklenen ve silinen satır sayılarını hesapla
      const addedLines = (gitDiff.match(/^\+[^+]/gm) || []).length;
      const removedLines = (gitDiff.match(/^-[^-]/gm) || []).length;

      // 2. Basit bir Conventional Commit türü belirleme mantığı
      let type = "chore";
      if (gitDiff.includes("fix(") || gitDiff.includes("error") || gitDiff.includes("bug")) {
        type = "fix";
      } else if (gitDiff.includes("test") || gitDiff.includes("spec")) {
        type = "test";
      } else if (addedLines > removedLines) {
        type = "feat";
      } else if (removedLines > 0) {
        type = "refactor";
      }

      const summary = `Diff analizi tamamlandı: +${addedLines} satır eklendi, -${removedLines} satır silindi.`;
      const suggestedCommitMsg = `${type}: update codebase (${addedLines} insertions, ${removedLines} deletions)`;

      // Analiz sonucunu A2A Artifact paketi olarak göreve ekle
      task.complete({
        agentId: this.card.id,
        status: "PASSED",
        summary,
        suggestedCommitMsg,
        stats: { addedLines, removedLines }
      });

      return task;
    } catch (error) {
      task.fail(`Özet ve commit mesajı oluşturulurken hata oluştu: ${error.message}`);
      return task;
    }
  }
}