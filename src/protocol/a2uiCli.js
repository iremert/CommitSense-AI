import chalk from "chalk";

export class A2UICliRenderer {
  render(result) {
    if (result.status === "EMPTY") {
      console.log(chalk.yellow(`\nℹ️  ${result.message}`));
      return;
    }

    const { decision, reports } = result;

    console.log("\n" + chalk.cyan.bold("=================================================="));
    console.log(chalk.cyan.bold("            CommitSense AI - Inspection            "));
    console.log(chalk.cyan.bold("=================================================="));

    // Status Banner
    if (decision.status === "PASS") {
      console.log(chalk.bgGreen.black.bold("\n  STATUS: PASS  ") + " " + chalk.green(decision.reason));
    } else if (decision.status === "WARN") {
      console.log(chalk.bgYellow.black.bold("\n  STATUS: WARN  ") + " " + chalk.yellow(decision.reason));
    } else {
      console.log(chalk.bgRed.white.bold("\n  STATUS: BLOCK ") + " " + chalk.red(decision.reason));
    }

    // Security Section
    console.log("\n" + chalk.bold.underline("🛡️  Security & Secret Scanner"));
    if (reports.security.issues.length === 0) {
      console.log(chalk.green("  ✔ Hiçbir güvenlik açığı veya sızıntı bulunamadı."));
    } else {
      reports.security.issues.forEach(issue => {
        console.log(chalk.red(`  ✖ [${issue.severity}] ${issue.message}`));
        console.log(chalk.gray(`    Öneri: ${issue.suggestion}`));
      });
    }

    // Quality Section
    console.log("\n" + chalk.bold.underline("🐞  Code Quality & Bug Inspector"));
    if (reports.quality.issues.length === 0) {
      console.log(chalk.green("  ✔ Kod kalitesi standartlara uygun."));
    } else {
      reports.quality.issues.forEach(issue => {
        console.log(chalk.yellow(`  ⚠️ [${issue.severity}] ${issue.message}`));
        console.log(chalk.gray(`    Öneri: ${issue.suggestion}`));
      });
    }

    // Commit Message Suggestion
    console.log("\n" + chalk.bold.underline("📝  Suggested Commit Message"));
    console.log(chalk.magenta(`  "${reports.context.suggestedCommitMsg}"`));

    console.log("\n" + chalk.cyan("==================================================\n"));
  }
}