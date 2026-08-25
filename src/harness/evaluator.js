export class HarnessEvaluator {
  /**
   * Alt ajan raporlarını değerlendirip nihai kararı verir.
   * @param {Object} securityReport - SecurityAgent çıktı verisi
   * @param {Object} qualityReport - QualityAgent çıktı verisi
   */
  
  evaluate(securityReport = {}, qualityReport = {}) {
    // Raporların içindeki 'issues' dizilerini güvenli şekilde al (Undefined/Null koruması)
    const secIssues = securityReport.issues || [];
    const qualIssues = qualityReport.issues || [];

    // Hata seviyelerine göre tespitler
    const hasCriticalSecurity = secIssues.some(i => i.severity === "CRITICAL");
    const hasHighSecurity = secIssues.some(i => i.severity === "HIGH");
    
    const hasCriticalQuality = qualIssues.some(i => i.severity === "CRITICAL");
    const hasHighQuality = qualIssues.some(i => i.severity === "HIGH");

    // 1. Durum: Kritik veya Yüksek Seviye Bir Engel Var (BLOCK)
    if (hasCriticalSecurity || hasHighSecurity || hasCriticalQuality || hasHighQuality) {
      const reasons = [];
      if (hasCriticalSecurity || hasHighSecurity) reasons.push("Güvenlik ihlali / Sızıntı tespiti");
      if (hasCriticalQuality || hasHighQuality) reasons.push("Kritik kod kalitesi / Mantık hatası tespiti");

      return {
        status: "BLOCK",
        reason: `Commit bloklandı: ${reasons.join(" ve ")}.`,
        actionRequired: "Lütfen tespit edilen kritik ve yüksek seviyeli hataları düzeltin."
      };
    }

    // 2. Durum: Sadece Düşük/Orta Seviye Uyarilar Var (WARN)
    if (secIssues.length > 0 || qualIssues.length > 0) {
      return {
        status: "WARN",
        reason: "Kod çalışabilir durumda fakat iyileştirilmesi gereken uyarilar var.",
        actionRequired: "Tespit edilen düşük seviyeli log ve format uyarılarını gözden geçirin."
      };
    }

    // 3. Durum: Kod Tamamen Temiz (PASS)
    return {
      status: "PASS",
      reason: "Tüm güvenlik ve kalite denetimleri başarıyla geçildi.",
      actionRequired: "Commit güvenle atılabilir."
    };
  }
}