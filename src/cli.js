#!/usr/bin/env node
import { GraphEngine } from "./graph/engine.js";
import { A2UICliRenderer } from "./protocol/a2uiCli.js";
import { loadConfig } from "./config.js";

async function main() {
  const engine = new GraphEngine();
  const renderer = new A2UICliRenderer();
  const config = loadConfig();

  // --staged veya -s bayrağı kontrolü
  const isStaged = process.argv.includes("--staged") || process.argv.includes("-s");
  
  // Analiz sürecini çalıştır
  const result = await engine.runInspection({ staged: isStaged, config });  
  // CLI arayüzüne sonuç raporunu çizdir
  renderer.render(result);

  // Eğer karar BLOCK ise Git hook'unun (pre-commit) durması için 1 koduyla çık
  if (result?.decision?.status === "BLOCK") {
    process.exit(1);
  }
}

// Beklenmeyen sistem hatalarını (Network, LLM API Down, Dosya Okuma Hataları) yakala
main().catch((error) => {
  console.error("\n❌ CommitSense beklenmeyen bir hatayla karşılaştı ve durduruldu:");
  console.error(error?.message || error);
  process.exit(1);
});