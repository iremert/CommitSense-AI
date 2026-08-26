import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GraphEngine } from "./graph/engine.js";
import { loadConfig } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const engine = new GraphEngine();

// Statik dosyaları dışarıya sun (public/index.html vb.)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// 1. Git Denetim API'si
app.get("/api/inspect", async (req, res) => {
  try {
    const isStaged = req.query.staged === "true";
    
    // .commitsenserc veya varsayılan yapılandırmayı yükle
    const config = loadConfig();
    
    // Analiz sürecini config verisiyle çalıştır
    const result = await engine.runInspection({ staged: isStaged, config });
    return res.json(result);
  } catch (error) {
    console.error("❌ Inspection sırasında hata oluştu:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "İnceleme sırasında sunucu hatası meydana geldi.",
      error: error.message
    });
  }
});

// 2. Kayıtlı A2A Ajan Kartları API'si
app.get("/api/agents", (req, res) => {
  try {
    const agentCards = engine.bus.getAgentCards();
    return res.json(agentCards);
  } catch (error) {
    console.error("❌ Ajan kartları çekilirken hata oluştu:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Ajan bilgileri alınamadı."
    });
  }
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`\n🌐 CommitSense AI Dashboard hazır: http://localhost:${PORT}`);
});