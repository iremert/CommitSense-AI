// config.js
import fs from 'fs';
import path from 'path';

export function loadConfig() {
  const defaultConfig = {
    severity: 'strict',
    ignore: ['node_modules/**', 'dist/**', '.git/**'],
    customRules: []
  };

  const configPath = path.join(process.cwd(), '.commitsenserc');

  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        ...defaultConfig,
        ...userConfig,
        ignore: [...defaultConfig.ignore, ...(userConfig.ignore || [])],
        customRules: userConfig.customRules || []
      };
    } catch (error) {
      // error değişkenini log mesajına dahil ettik:
      console.warn('⚠️ .commitsenserc dosyası okunamadı veya formatı geçersiz:', error.message);
    }
  }

  return defaultConfig;
}