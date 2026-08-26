import { GraphEngine } from './graph/engine.js';
import { loadConfig } from './config.js';
import { execSync } from 'child_process';

export class CommitSense {
  constructor(options = {}) {
    this.userConfig = options.config || loadConfig();
    this.graphEngine = new GraphEngine(this.userConfig);
  }

  async inspectStaged() {
    try {
      const gitDiff = execSync('git diff --staged', { encoding: 'utf8' });
      if (!gitDiff || gitDiff.trim() === '') {
        return {
          status: 'SKIPPED',
          message: 'Staged alanda analiz edilecek değişiklik bulunamadı.',
          results: []
        };
      }
      return await this.graphEngine.runInspection(gitDiff);
    } catch (error) {
      throw new Error(`Git diff alınırken hata oluştu: ${error.message}`);
    }
  }

  async inspectDiff(rawDiff) {
    if (!rawDiff || typeof rawDiff !== 'string' || rawDiff.trim() === '') {
      throw new Error('Analiz için geçerli bir diff metni sağlanmalıdır.');
    }
    const result = await this.graphEngine.runInspection(rawDiff);
    return result;
  }
}

export async function inspectCode(gitDiff, customConfig = null) {
  const instance = new CommitSense({ config: customConfig });
  return await instance.inspectDiff(gitDiff);
}