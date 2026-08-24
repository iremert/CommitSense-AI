const API_SECRET = "sk_test_123456789";
console.log("debug log");

import { GraphEngine } from "./graph/engine.js";
import { A2UICliRenderer } from "./protocol/a2uiCli.js";

async function main() {
  const engine = new GraphEngine();
  const renderer = new A2UICliRenderer();

  const isStaged = process.argv.includes("--staged");
  const result = await engine.runInspection({ staged: isStaged });
  
  renderer.render(result);

  if (result.decision?.status === "BLOCK") {
    process.exit(1); // Git commit hook'unun durması için çıkış kodu 1
  }
}

main().catch(console.error);