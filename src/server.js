import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GraphEngine } from "./graph/engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const engine = new GraphEngine();

app.use(express.static(path.join(__dirname, "public")));

// Inspection API
app.get("/api/inspect", async (req, res) => {
  const result = await engine.runInspection({ staged: req.query.staged === "true" });
  res.json(result);
});

// Registered A2A Agents API
app.get("/api/agents", (req, res) => {
  res.json(engine.bus.getAgentCards());
});

app.listen(PORT, () => {
  console.log(`\n🌐 Web Dashboard hazır: http://localhost:${PORT}`);
});