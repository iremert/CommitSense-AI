# 🚀 CommitSense AI

> **Agentic Git Security & Quality Inspection Engine**

CommitSense AI; yazılım geliştirme süreçlerinde `git commit` öncesinde, CI/CD boru hatlarında veya özel Node.js uygulamalarında kod değişikliklerini (`git diff`) otonom çoklu ajan (Multi-Agent) mimarisiyle tarayan, güvenlik ihlallerini ve kod kalitesi sorunlarını anlık olarak tespit eden modüler bir denetim ve SDK motorudur.

---

## 🛠️ Kurulum ve Kullanım

CommitSense AI projesini bilgisayarınızda yerel olarak (geliştirici modu) çalıştırabilir veya doğrudan bir projeye paket olarak entegre edebilirsiniz.

### 1. Yerel Geliştirme ve Kaynak Koddan Kurulum (Developer Setup)
Proje kodlarını incelemek, katkıda bulunmak veya Web Dashboard / CLI arayüzünü kaynak kod üzerinden bizzat deneyimlemek için:

```bash
# 1. Repoyu klonlayın ve proje klasörüne gidin
git clone [https://github.com/iremert/CommitSense-AI.git](https://github.com/iremert/CommitSense-AI.git)
cd CommitSense-AI

# 2. Bağımlılıkları yükleyin
npm install

# 3. CLI modunda yerel olarak çalıştırın:
# Sadece sahneye alınan (staged) değişiklikleri tara:
node src/cli.js --staged

# Çalışma alanındaki tüm değişiklikleri tara:
node src/cli.js --all

# 4. Canlı Web Dashboard modunda çalıştırmak için:
npm run web
```

### 2. NPM Paketi Olarak Kullanım (Package Integration)

#### A. Hızlı Kullanım (Sıfır Kurulum / npx)
Projede hiçbir kurulum yapmadan doğrudan çalıştırmak için:

```bash
# Sadece staged (sahneye alınan) değişiklikleri tara
npx commit-sense-ai --staged

# Tüm çalışma alanını tara
npx commit-sense-ai --all
```

#### B. Proje Bağımlılığı Olarak Ekleme (npm install)
Ekibinizdeki tüm geliştiricilerin aynı standartta tarama yapabilmesi için projenize geliştirme bağımlılığı (devDependencies) olarak ekleyin:

```bash
npm install --save-dev commit-sense-ai

# package.json dosyanızdaki scripts alanına ekleyerek kolayca çalıştırabilirsiniz:
{
  "scripts": {
    "inspect": "commit-sense --staged"
  }
}
#Terminalden çalıştırmak için:
npm run inspect
```

### 3. Otomatik Git Pre-Commit Hook Entegrasyonu (Husky)

`git commit` atıldığı an taramanın otomatik çalışması ve kritik ihlal durumunda (**BLOCK**) commit işleminin Git tarafından iptal edilmesi için:

1. Projenize Husky'yi kurun:
```bash
   npm install --save-dev husky
   npx husky init
  
   ```
2. Otomatik tarama kuralını .husky/pre-commit dosyasına ekleyin:
```bash
  npx commit-sense-ai --staged
   ```

* Nasıl Çalışır?
Geliştirici git commit attığı an CommitSense otomatik devreye girer. Kodda API Key sızıntısı veya kritik bir ihlal varsa commit iptal edilir ve güvensiz kodun repoya girmesi engellenir.


### 4. CI/CD Pipeline Entegrasyonu (GitHub Actions)

Projenize yapılan Push veya Pull Request (PR) işlemlerinde kodun otomatik olarak güvenlik ve kalite denetiminden geçmesini sağlamak için `.github/workflows/commit-sense.yml` dosyasını ekleyin:

```yaml
name: CommitSense AI Inspection

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  inspect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npx commit-sense-ai --all

```
* `.github/workflows/commit-sense.yml` dosyasını oluşturup kaydettikten sonra projeyi GitHub'a push ederek Actions sekmesinden canlı çalışmasını kontrol edelim!
* CI/CD Pipeline Doğrulaması:
![CommitSense AI CI/CD Passed](docs/images/action.png)

### 5. Yapılandırabilirlik (.commitsenserc)

Projenizin kök dizinine `.commitsenserc` dosyası ekleyerek tarama kurallarını, hariç tutulacak dosyaları (ignore) ve şirketinize özel gizli bilgi (secret) desenlerini tanımlayabilirsiniz:

```json
{
  "severity": "strict",
  "ignore": [
    "node_modules/**",
    "dist/**",
    "docs/images/**"
  ],
  "customRules": [
    {
      "id": "company-secret",
      "name": "Şirket Özel Key Sızıntısı",
      "pattern": "COMP_KEY_[a-zA-Z0-9]{16}",
      "severity": "critical",
      "message": "Şirket içi özel API key sızıntısı tespit edildi! Lütfen .env dosyasına taşıyın."
    }
  ]
}
```

### 6. Programatik SDK & API Entegrasyonu

CommitSense AI, Node.js / TypeScript uygulamalarınız, CI/CD süreçleriniz, backend servisleriniz veya dahili araçlarınıza doğrudan modül olarak entegre edilebilir.

#### Kurulum

```bash
npm install commit-sense-ai
``` 

* Kullanım Senaryoları
1. Kod Diff Analizi (Custom Diff Inspection)
Uygulama içinden dinamik olarak metin formatındaki kod farklarını analiz edin:
```bash
import { CommitSense } from 'commit-sense-ai';

const commitSense = new CommitSense();

const diff = `
+ const secretKey = "------";
+ console.log("Debugging session");
`;

const analysis = await commitSense.inspectDiff(diff);

if (analysis.decision.status === 'BLOCK') {
  console.error('🚫 Güvenlik / Kalite İhlali Saptandı!');
  console.log('Neden:', analysis.decision.reason);
} else {
  console.log('✅ Kod diff geçişe uygun.');
}
``` 

2. Tek Satırlık Hızlı Çağrı
Kestirme fonksiyon ile hızlıca analiz yapın:
```bash
import { inspectCode } from 'commit-sense-ai';

const result = await inspectCode(rawGitDiff);
console.log(result.reports.security);
``` 

3. Yerel Staging Alanı Denetimi
Özel build script'lerinizde yerel git staging alanını kontrol edin:
```bash
import { CommitSense } from 'commit-sense-ai';

const inspector = new CommitSense();
const result = await inspector.inspectStaged();

console.log('Staging Durumu:', result.status);
``` 

SDK Çıktı Yapısı (Payload Schema)
```bash
{
  "timestamp": "2026-08-26T16:53:38.586Z",
  "decision": {
    "status": "PASS | BLOCK | WARN",
    "reason": "Tüm güvenlik ve kalite denetimleri başarıyla geçildi.",
    "actionRequired": "Commit güvenle atılabilir."
  },
  "reports": {
    "security": {
      "agentId": "security-agent",
      "status": "PASSED | FAILED",
      "issues": []
    },
    "quality": {
      "agentId": "quality-agent",
      "status": "PASSED | FAILED",
      "issues": []
    },
    "context": {
      "agentId": "context-agent",
      "summary": "Diff analizi tamamlandı.",
      "suggestedCommitMsg": "feat: update codebase"
    }
  }
}
``` 


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
+-------------------------------------------------------+
               |  CLI  |  Web Dashboard  |  Git Hooks  |  SDK / API   |
               +-------------------------------------------------------+
                                           |
                                           v
                               +-----------------------+
                               |    .commitsenserc     |
                               | (Konfigürasyon Motoru)|
                               +-----------------------+
                                           |
                                           v
                               +-----------------------+
                               |      GraphEngine      |
                               |     (Orkestratör)     |
                               +-----------------------+
                                           |
                 +-------------------------+-------------------------+
                 |                         |                         |
                 v                         v                         v
       +-------------------+     +-------------------+     +-------------------+
       |    MCP Server     |     |  A2A Message Bus  |     | HarnessEvaluator  |
       | (Git Diff/Staging)|     | (Görev Dağıtımı)  |     |   (Nihai Karar)   |
       +-------------------+     +-------------------+     +-------------------+
                                           |
                 +-------------------------+-------------------------+
                 |                         |                         |
                 v                         v                         v
       +-------------------+     +-------------------+     +-------------------+
       |   SecurityAgent   |     |   QualityAgent    |     |   ContextAgent    |
       | (Secret & Pattern)|     |  (Code Hygiene)   |     | (Semantic Commit) |
       +-------------------+     +-------------------+     +-------------------+

```

### 1. Model Context Protocol (MCP) Katmanı
Git deposundaki staged (sahneye alınan) veya dışarıdan sağlanan ham metin farklarını (raw diff) güvenli bir şekilde okur ve ajanların işleyebileceği yapılandırılmış veri formatına dönüştürür.

### 2. Yapılandırma ve Kural Motoru (.commitsenserc)
Proje kökündeki konfigürasyon dosyasını tarayarak dinamik hariç tutma (ignore) kurallarını, katılık seviyelerini (strict, moderate) ve şirkete özel yazılmış özel regex sızıntı desenlerini (custom secret rules) çalışma zamanında ajanlara enjekte eder.

### 3. A2A (Agent-to-Agent) Protokolü
Ajanların kendi aralarında ortak veri formatında (Task, AgentCard, Artifact) haberleşmesini ve bağımsız görev yürütmesini (ExecuteTask) sağlar.

### 4. Otonom Alt Ajanlar (Subagents)
* 🛡️ **SecurityAgent:** AWS Key, Private Key, JWT gibi hassas bilgilerin sızmasını önler.
* 🐞 **QualityAgent:** `debugger`, boş `catch` blokları, print/log kalıntıları gibi kod hijyeni ihlallerini yakalar.
* 🧠 **ContextAgent:** Kodun mimari bağlamını inceleyerek geliştiriciye Conventional Commits formatında açıklayıcı commit mesajları önerir.

### 5. Harness Evaluator (Karar Mekanizması)
Tüm ajanlardan gelen analiz sonuçlarını (Artifacts) birleştirerek projenin commit edilebilirliğine dair nihai kararı verir:
* 🟢 **PASS:** Kod temiz, commit atılabilir.
* 🟡 **WARN:** Küçük kalite sorunları var, dikkat edilmeli.
* 🔴 **BLOCK:** Kritik güvenlik veya kod hatası var, commit engellendi!

---

## 📊 Öne Çıkan Özellikler

* 🖥️ **Çoklu Arayüz Desteği:** Terminal (CLI), Canlı Web Dashboard ve Git Pre-commit Hook (Husky) üzerinden kesintisiz çalışabilme.
* 📦 **Programlanabilir SDK (API):** Kendi Node.js/TypeScript projelerinize, CI/CD süreçlerinize veya botlarınıza `import { CommitSense } from 'commit-sense-ai'` ile kolayca entegre edebilme.
* ⚙️ **Esnek ve Dinamik Yapılandırma (`.commitsenserc`):** Özel secret kalıpları tanımlama, belirli dosya yollarını taramadan muaf tutma (ignore) ve katılık seviyelerini özelleştirebilme.
* ⚡ **Eşzamanlı Paralel Analiz:** A2A yapısı sayesinde tüm alt ajanların diff verisini `Promise.all` kurgusuyla milisaniyeler içinde incelemesi.
* ⚙️ **Akıllı Commit Önerisi:** Yapılan değişiklikleri (dosya yolları ve kod kalıpları) analiz ederek kural tabanlı Conventional Commit mesajları üretme.


---
