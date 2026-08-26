import { AgentCard, Task, TaskStatus } from "../../protocol/a2a.js";

export class SecurityAgent {
  constructor() {
    this.card = new AgentCard({
      id: "security-agent",
      name: "Security & Secret Scanner",
      role: "Security Specialist",
      description: "Scans code diffs for secrets, API keys, hardcoded credentials, custom patterns, and dangerous functions.",
      skills: [
        { id: "secret-leak-detection", name: "Secret Scanner" },
        { id: "vulnerability-scan", name: "Vulnerability Detector" }
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

      // 1. Kural: API Key & Token Regex Taraması (Kritik Seviye)
      const patterns = [
        { name: "OpenAI API Key", regex: /sk-[a-zA-Z0-9]{32,}/g },
        { name: "AWS Access Key", regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g },
        { name: "GitHub Personal Access Token", regex: /ghp_[a-zA-Z0-9]{36}/g },
        { name: "Generic Private Key", regex: /-----BEGIN PRIVATE KEY-----/g }
      ];

      for (const p of patterns) {
        if (p.regex.test(gitDiff)) {
          issues.push({
            severity: "CRITICAL",
            file: "Detected in diff",
            message: `Açıkça görünen ${p.name} sızıntısı tespiti!`,
            suggestion: "Bu anahtarı derhal iptal edin (revoke) ve .env dosyasına taşıyın."
          });
        }
      }

      // 2. Kural: Hardcoded Database Connection String (Yüksek Seviye)
      const dbUriRegex = /(mongodb|postgres|mysql|redis):\/\/[^\s"']+/g;
      if (dbUriRegex.test(gitDiff)) {
        issues.push({
          severity: "HIGH",
          file: "Detected in diff",
          message: "Kod içinde hardcoded veritabanı bağlantı adresi (Connection String) tespiti!",
          suggestion: "Veritabanı erişim bilgilerini çevre değişkenlerine (environment variables) çıkarın."
        });
      }

      // 3. Kural: Tehlikeli Fonksiyon / Remote Code Execution Riski (Kritik Seviye)
      if (/\beval\s*\(/.test(gitDiff) || /\bchild_process\.exec\s*\(/.test(gitDiff)) {
        issues.push({
          severity: "CRITICAL",
          file: "Detected in diff",
          message: "Güvensiz kod çalıştırma potansiyeli! (eval veya exec kullanımı)",
          suggestion: "Dışarıdan gelen veriyi çalıştıran dinamik kod bloklarından kaçının."
        });
      }

      // 4. Kural: Güvensiz HTTP Kullanımı (Düşüş Seviye)
      if (/http:\/\/[^\s"']+/g.test(gitDiff)) {
        issues.push({
          severity: "LOW",
          file: "Detected in diff",
          message: "Şifrelenmemiş HTTP protokolü kullanımı tespiti.",
          suggestion: "Güvenli iletişim için HTTPS protokolünü tercih edin."
        });
      }

      // 5. Kural: .commitsenserc İçinden Gelen Özel Kurallar (Custom Rules) Taraması
      if (Array.isArray(config.customRules) && config.customRules.length > 0) {
        for (const rule of config.customRules) {
          if (!rule.pattern) continue;
          
          const customRegex = new RegExp(rule.pattern, "g");
          if (customRegex.test(gitDiff)) {
            issues.push({
              severity: (rule.severity || "HIGH").toUpperCase(),
              file: "Detected in diff",
              message: rule.message || `Özel güvenlik kuralı ihlali: ${rule.name || rule.id}`,
              suggestion: rule.suggestion || "Tanımlanan özel güvenlik kuralına uyacak şekilde kodunuzu güncelleyin."
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
      task.fail(`Güvenlik taraması sırasında hata oluştu: ${error.message}`);
      return task;
    }
  }
}