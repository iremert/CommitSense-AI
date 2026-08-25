import { AgentCard, Task, TaskStatus } from "../../protocol/a2a.js";

export class QualityAgent {
  constructor() {
    this.card = new AgentCard({
      id: "quality-agent",
      name: "Code Quality & Bug Inspector",
      role: "Quality Assurance Specialist",
      description: "Inspects code quality, logic bugs, unhandled errors, and forgotten debug code.",
      skills: [
        { id: "bug-detection", name: "Bug Inspector" },
        { id: "code-smell-detection", name: "Code Smell Detector" }
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
      const issues = [];

      // 1. Kural: Unutulmuş console.log tespiti (Düşük Seviye)
      if (gitDiff.includes("console.log")) {
        issues.push({
          severity: "LOW",
          file: "Detected in diff",
          message: "Unutulmuş console.log() tespiti.",
          suggestion: "Prodüksiyona çıkmadan önce log ifadelerini temizleyin."
        });
      }

      // 2. Kural: Unutulmuş TODO / FIXME tespiti (Düşük Seviye)
      if (gitDiff.includes("TODO:") || gitDiff.includes("FIXME:")) {
        issues.push({
          severity: "LOW",
          file: "Detected in diff",
          message: "Tamamlanmamış TODO veya FIXME notu tespiti.",
          suggestion: "Yarım kalan işleri commit etmeden önce tamamlayın veya issue açın."
        });
      }

      // 3. Kural: Unutulmuş debugger tespiti (Kritik Seviye)
      if (gitDiff.includes("debugger;")) {
        issues.push({
          severity: "CRITICAL",
          file: "Detected in diff",
          message: "Kodu durduran 'debugger;' ifadesi tespiti!",
          suggestion: "Debugger kodlarını derhal kaldırın."
        });
      }

      // 4. Kural: Boş catch bloğu tespiti / Hata Yutma (Yüksek Seviye)
      // Örnek: catch (e) {} veya catch {}
      const emptyCatchRegex = /catch\s*\([^\)]*\)\s*\{\s*\}/g;
      if (emptyCatchRegex.test(gitDiff)) {
        issues.push({
          severity: "HIGH",
          file: "Detected in diff",
          message: "Hataların yutulduğu boş 'catch' bloğu tespiti!",
          suggestion: "Hataları sessizce yutmak yerine en azından loglayın veya rethrow yapın."
        });
      }

      // Analiz sonucunu A2A Artifact paketi olarak göreve ekle
      // HIGH veya CRITICAL bir hata varsa ajanın kararı FAILED olur.
      task.complete({
        agentId: this.card.id,
        status: issues.some(i => i.severity === "HIGH" || i.severity === "CRITICAL") ? "FAILED" : "PASSED",
        issues
      });

      return task;
    } catch (error) {
      task.fail(`Kalite taraması sırasında hata oluştu: ${error.message}`);
      return task;
    }
  }
}