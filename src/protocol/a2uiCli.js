import chalk from "chalk";

export class A2UICliRenderer {
  render(result) {
    if (!result || result.status === "EMPTY") {
      console.log(chalk.yellow(`\nℹ️  ${result?.message || "İncelenecek Git değişikliği bulunamadı."}`));
      return;
    }

    const { decision = {}, reports = {}, tasks = {} } = result;

    console.log("\n" + chalk.cyan.bold("=================================================="));
    console.log(chalk.cyan.bold("             CommitSense AI - Inspection          "));
    console.log(chalk.cyan.bold("=================================================="));

    // 1. Status Banner (Genel Sonuç)
    if (decision.status === "PASS") {
      console.log(chalk.bgGreen.black.bold("\n  STATUS: PASS  ") + " " + chalk.green(decision.reason));
    } else if (decision.status === "WARN") {
      console.log(chalk.bgYellow.black.bold("\n  STATUS: WARN  ") + " " + chalk.yellow(decision.reason));
    } else {
      console.log(chalk.bgRed.white.bold("\n  STATUS: BLOCK ") + " " + chalk.red(decision.reason || "Kritik engeller tespit edildi."));
    }

    // 2. Güvenlik Taraması Bölümü (Security)
    const secIssues = reports.security?.issues || [];
    console.log("\n" + chalk.bold.underline("🛡️  Security & Secret Scanner"));
    if (secIssues.length === 0) {
      console.log(chalk.green("  ✔ Hiçbir güvenlik açığı veya sızıntı bulunamadı."));
    } else {
      secIssues.forEach(issue => {
        const isCritical = issue.severity === "CRITICAL" || issue.severity === "HIGH";
        const badge = isCritical ? chalk.red(`  ✖ [${issue.severity}]`) : chalk.yellow(`  ⚠️ [${issue.severity}]`);
        console.log(`${badge} ${issue.message}`);
        if (issue.suggestion) {
          console.log(chalk.gray(`    Öneri: ${issue.suggestion}`));
        }
      });
    }

    // 3. Kod Kalitesi Bölümü (Quality)
    const qualIssues = reports.quality?.issues || [];
    console.log("\n" + chalk.bold.underline("🐞  Code Quality & Bug Inspector"));
    if (qualIssues.length === 0) {
      console.log(chalk.green("  ✔ Kod kalitesi standartlara uygun."));
    } else {
      qualIssues.forEach(issue => {
        const isCritical = issue.severity === "CRITICAL" || issue.severity === "HIGH";
        const badge = isCritical ? chalk.red(`  ✖ [${issue.severity}]`) : chalk.yellow(`  ⚠️ [${issue.severity}]`);
        console.log(`${badge} ${issue.message}`);
        if (issue.suggestion) {
          console.log(chalk.gray(`    Öneri: ${issue.suggestion}`));
        }
      });
    }

    // 4. Git Bağlamı ve Commit Önerisi (Context)
    const contextReport = reports.context || {};
    console.log("\n" + chalk.bold.underline("📝  Git Context & Suggested Commit"));
    if (contextReport.summary) {
      console.log(chalk.gray(`  Özet: ${contextReport.summary}`));
    }
    if (contextReport.suggestedCommitMsg) {
      console.log(chalk.magenta.bold(`  Commit Mesajı: "${contextReport.suggestedCommitMsg}"`));
    }

    console.log("\n" + chalk.cyan("==================================================\n"));
  }
}