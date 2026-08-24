export class HarnessEvaluator {
  evaluate(securityReport, qualityReport) {
    const hasCriticalSecurity = securityReport.issues.some(i => i.severity === "CRITICAL");
    const hasHighSecurity = securityReport.issues.some(i => i.severity === "HIGH");
    const hasQualityErrors = qualityReport.issues.some(i => i.severity === "HIGH");

    // 1. Kritik güvenlik riski varsa blokla
    if (hasCriticalSecurity || hasHighSecurity) {
      return {
        status: "BLOCK",
        reason: "Kritik güvenlik zafiyeti veya hassas veri sızıntısı tespiti!",
        actionRequired: "Lütfen taranan API key/hassas verileri temizleyin."
      };
    }

    // 2. Sadece uyarı düzeyinde hatalar varsa WARN ver
    if (qualityReport.issues.length > 0 || securityReport.issues.length > 0) {
      return {
        status: "WARN",
        reason: "Kod düzgün çalışabilir fakat bazı iyileştirmeler gerekiyor.",
        actionRequired: "Log ifadelerini ve uyarıları gözden geçirin."
      };
    }

    // 3. Her şey temizse PASS
    return {
      status: "PASS",
      reason: "Tüm güvenlik ve kalite denetimleri başarıyla geçildi.",
      actionRequired: "Commit güvenle atılabilir."
    };
  }
}