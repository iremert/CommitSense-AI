import { FastMCP } from "fastmcp";
import { exec } from "child_process"; //Node.js'in bilgisayarının terminalinde (CMD / PowerShell)
// komut (git diff, git status vb.) çalıştırmasını sağlayan yerleşik modülüdür.
import { promisify } from "util"; //JavaScript'in Promise (Promise'lar) kullanımını kolaylaştıran yardımcı fonksiyon.
import { z } from "zod"; //Ajanlardan gelen parametrelerin tiplerini (boolean, string vb.) 
// doğru ve güvenli mi diye kontrol eden şema doğrulama kütüphanesidir.

const execAsync = promisify(exec);

// FastMCP Sunucusu Oluşturuluyor
export const gitMcpServer = new FastMCP({
  name: "commit-sense-git-mcp",
  version: "1.0.0",
});

// Tool 1: get_git_diff
gitMcpServer.addTool({
  name: "get_git_diff",
  description: "Staged veya çalışma alanındaki Git diff verisini yakalar.",
  parameters: z.object({
    staged: z
      .boolean()
      .optional()
      .describe("Sadece staged (git add) değişiklikleri mi alsın?"),
  }),
  execute: async (args) => {
    try {
      // Hem staged hem unstaged takibi için 'git diff HEAD' veya parametre kontrolü:
      const command = args.staged ? "git diff --staged" : "git diff HEAD";
      const { stdout } = await execAsync(command);
      return stdout.trim() || "Herhangi bir Git değişikliği bulunamadı.";
    } catch (error) {
      return `[MCP ERROR] ${error.message}`;
    }
  },
});

// Tool 2: get_git_status
gitMcpServer.addTool({
  name: "get_git_status",
  description: "Mevcut repository durumunu ve değiştirilen dosyaları getirir.",
  parameters: z.object({}),
  execute: async () => {
    try {
      const { stdout } = await execAsync("git status --short");
      return stdout.trim() || "Çalışma dizini temiz.";
    } catch (error) {
      return `[MCP ERROR] ${error.message}`;
    }
  },
});

// GraphEngine'in doğrudan çağırabileceği in-process wrapper
export class GitMcpServer {
  async executeTool(name, args = {}) {
    try {
      if (name === "get_git_diff") {
        const command = args.staged ? "git diff --staged" : "git diff HEAD";
        const { stdout } = await execAsync(command);
        return stdout.trim() || "Herhangi bir Git değişikliği bulunamadı.";
      }
      if (name === "get_git_status") {
        const { stdout } = await execAsync("git status --short");
        return stdout.trim() || "Çalışma dizini temiz.";
      }
      throw new Error(`Unknown MCP tool: ${name}`);
    } catch (error) {
      return `[MCP ERROR] ${error.message}`;
    }
  }
}