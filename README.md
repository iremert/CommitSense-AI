# 🚀 CommitSense AI

> **Agentic Git Security & Quality Inspection Engine**

CommitSense AI, yazılım geliştirme süreçlerinde `git commit` öncesi veya CI/CD aşamalarında kod değişikliklerini (`git diff`) çoklu ajan (Multi-Agent) mimarisiyle tarayan, güvenlik ihlallerini ve kod kalitesi sorunlarını anlık olarak tespit eden yapay zeka destekli bir denetim motorudur.

---

## 💡 Neden CommitSense AI?

Geleneksel linter ve linter benzeri statik analiz araçları kural tabanlı çalışır ve kodun **bağlamını (context)** anlayamaz. CommitSense AI ise:
* Hassas veri (API Key, Secret vb.) sızıntılarını commit atılmadan önce **engeller (BLOCK)**.
* Unutulmuş `debugger`, `console.log` veya hatalı kod kalıplarını **uyarır (WARN)**.
* Yapılan değişiklikleri analiz ederek standartlara uygun **Commit Mesajı önerileri** sunar.
* Terminal (CLI) ve Canlı İzleme (Web Dashboard) arabirimleri üzerinden anlık geri bildirim sağlar.

---

## 🏗️ Mimari ve Katmanlar

Proje, bağımsız modüllerin ve ajanların haberleştiği modüler bir mimari üzerine kurulmuştur:

```text
               +----------------------------------+
               |  CLI / Web Dashboard / Pre-Commit |
               +----------------------------------+
                                |
                                v
                      +-------------------+
                      |    GraphEngine    |
                      |   (Orkestratör)   |
                      +-------------------+
                                |
         +----------------------+----------------------+
         |                      |                      |
         v                      v                      v
+-----------------+   +-------------------+   +------------------+
|   MCP Server    |   |  A2A Message Bus  |   | HarnessEvaluator |
| (git diff/status|   | (Görev Dağıtımı)  |   | (Nihai Karar)    |
+-----------------+   +-------------------+   +------------------+
                                |
         +----------------------+----------------------+
         |                      |                      |
         v                      v                      v
+-----------------+   +-------------------+   +------------------+
|  SecurityAgent  |   |   QualityAgent    |   |   ContextAgent   |
| (Secret Scan)   |   | (Code Hygiene)    |   | (Semantic/Diff)  |
+-----------------+   +-------------------+   +------------------+

```

### 1. Model Context Protocol (MCP) Katmanı
Git deposundaki staged (sahneye alınan) veya unstaged (çalışma alanındaki) değişiklikleri güvenli bir şekilde `git diff` ve `git status` araçları üzerinden okur ve ajanlara aktarır.

### 2. A2A (Agent-to-Agent) Protokolü
Ajanların kendi aralarında ortak veri formatında (Task, AgentCard, Artifact) haberleşmesini ve bağımsız görev yürütmesini (ExecuteTask) sağlar.

### 3. Otonom Alt Ajanlar (Subagents)
* 🛡️ **SecurityAgent:** AWS Key, Private Key, JWT gibi hassas bilgilerin sızmasını önler.
* 🐞 **QualityAgent:** `debugger`, boş `catch` blokları, print/log kalıntıları gibi kod hijyeni ihlallerini yakalar.
* 🧠 **ContextAgent:** Kodun mimari bağlamını inceleyerek geliştiriciye Conventional Commits formatında açıklayıcı commit mesajları önerir.

### 4. Harness Evaluator (Karar Mekanizması)
Tüm ajanlardan gelen analiz sonuçlarını (Artifacts) birleştirerek projenin commit edilebilirliğine dair nihai kararı verir:
* 🟢 **PASS:** Kod temiz, commit atılabilir.
* 🟡 **WARN:** Küçük kalite sorunları var, dikkat edilmeli.
* 🔴 **BLOCK:** Kritik güvenlik veya kod hatası var, commit engellendi!

---

## 📊 Öne Çıkan Özellikler

* **Çift Arayüz Desteği:** Hem renkli ve bilgilendirici bir CLI arayüzü hem de tarayıcı üzerinden kontrol edilebilen canlı Web Dashboard.
* **Hızlı Paralel Analiz:** Tüm alt ajanlar `Promise.all` kurgusuyla diff verisini eş zamanlı inceler.
* **Esnek Kural Seti:** Güvenlik ve kalite standartlarına göre kolayca genişletilebilir ajan mimarisi.