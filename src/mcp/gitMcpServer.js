import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class GitMcpServer {
  constructor() {
    this.name = "commit-sense-git-mcp";
    this.version = "1.0.0";
  }

  // MCP Tool tanımları (Ajanların göreceği yetenek listesi)
  getTools() {
    return [
      {
        name: "get_git_diff",
        description: "Staged veya çalışma alanındaki Git diff verisini yakalar.",
        inputSchema: {
          type: "object",
          properties: {
            staged: { type: "boolean", description: "Sadece staged (git add) değişiklikleri mi alsın?" }
          }
        }
      },
      {
        name: "get_git_status",
        description: "Mevcut repository durumunu ve değiştirilen dosyaları getirir.",
        inputSchema: { type: "object", properties: {} }
      }
    ];
  }

  // MCP Tool tetikleme mantığı
  async executeTool(toolName, params = {}) {
    try {
      if (toolName === "get_git_diff") {
        const command = params.staged ? "git diff --staged" : "git diff";
        const { stdout } = await execAsync(command);
        return stdout.trim() || "Herhangi bir Git değişikliği bulunamadı.";
      }

      if (toolName === "get_git_status") {
        const { stdout } = await execAsync("git status --short");
        return stdout.trim() || "Çalışma dizini temiz.";
      }

      throw new Error(`Bilinmeyen MCP Tool: ${toolName}`);
    } catch (error) {
      return `[MCP ERROR] ${error.message}`;
    }
  }
}