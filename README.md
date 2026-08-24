# 🚀 CommitSense AI

Agentic Git Security & Quality Inspector powered by Google A2A, MCP, and A2UI.

## Features
- **MCP Protocol:** Reads Git diff and repository status safely.
- **A2A Architecture:** Orchestrates Multi-Agent system (Security, Quality, Context agents).
- **Harness Evaluator:** Automated PASS/WARN/BLOCK decision layer.
- **A2UI CLI & Web Dashboard:** Real-time visual evaluation outputs.

## Quick Start
```bash
npm install
npm start       # Run CLI Inspector
npm run web     # Run Web Dashboard (localhost:3000)


---

### 2. Terminalde Çalıştırılacak Komutlar

`README.md` dosyasını kaydettikten sonra VS Code terminalinde (PowerShell) sırasıyla şu komutları koştur:

```powershell
# 1. Değişiklikleri Git'e ekle ve ilk commit'i at
git add .
git commit -m "feat(core): initial release of CommitSense AI"

# 2. Ana dalı main yap
git branch -M main

# 3. GitHub repository bağlantını ekle (Kendi GitHub repo URL'ni yapıştır)
git remote add origin https://github.com/KULLANICI_ADI/commit-sense-ai.git

# 4. Kodları GitHub'a gönder
git push -u origin main