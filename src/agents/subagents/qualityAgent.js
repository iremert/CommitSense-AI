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
   * @param {object} config - .commitsenserc içerik nesnesi
   */
  async executeTask(task, gitDiff, config = {}) {
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

      const cleanDiff = gitDiff
      .split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++')) // Sadece yeni eklenen satırlar
      .map(line => line.substring(1)) // Baştaki '+' işaretini kaldır
      .join('\n');
      
      // 4. Kural: Boş catch bloğu tespiti / Hata Yutma (Yüksek Seviye)
      const emptyCatchRegex = /catch\s*(\([^)]*\))?\s*\{\s*\}/g;
      if (emptyCatchRegex.test(cleanDiff) && !cleanDiff.includes('emptyCatchRegex')) {
        findings.push({
          severity: "HIGH",
          ruleId: "empty-catch-block",
          message: "Hataların yutulduğu boş 'catch' bloğu tespiti!",
          suggestion: "Hataları sessizce yutmak yerine en azından loglayın veya rethrow yapın."
        });
      }

      // 5. Kural: .commitsenserc Tarafından Gelen Özel Kalite Kuralları (Varsa)
      if (Array.isArray(config.customQualityRules) && config.customQualityRules.length > 0) {
        for (const rule of config.customQualityRules) {
          if (!rule.pattern) continue;
          const customRegex = new RegExp(rule.pattern, "g");
          if (customRegex.test(gitDiff)) {
            issues.push({
              severity: (rule.severity || "LOW").toUpperCase(),
              file: "Detected in diff",
              message: rule.message || `Özel kalite kuralı ihlali: ${rule.name || rule.id}`,
              suggestion: rule.suggestion || "Kod kalitesini artırmak için ilgili ifadeyi düzeltin."
            });
          }
        }
      }

      // Analiz sonucunu A2A Artifact paketi olarak göreve ekle
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