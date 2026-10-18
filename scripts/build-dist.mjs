// Monta dist/ só com os arquivos do jogo (sem testes, scripts, SQL, documentação e servidor), para
// hospedagens que publicam um "diretório de saída" como site estático. Roda no "npm run build".
import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "dist");
const skip = new Set([".git", ".gitignore", "node_modules", "tests", "scripts", "supabase", "dist", "out", "server.js", "servidor-local.mjs", "package.json", "package-lock.json", "README.md", "ART_ASSETS.md", "CLAUDE.md", "LEIA-ME-PRIMEIRO.txt", "INICIAR-JOGO.bat"]);
rmSync(target, { recursive: true, force: true });
mkdirSync(target);
let copied = 0;
for (const name of readdirSync(root)) {
  if (skip.has(name) || name.endsWith(".zip") || name.endsWith(".apk") || name.endsWith(".log")) continue;
  cpSync(join(root, name), join(target, name), { recursive: true });
  copied++;
}
console.log("dist/ montado com " + copied + " itens do jogo");
