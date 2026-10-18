// Depois do build do starter (ChatGPT Sites), deixa uma cópia estática do jogo em out/.
// O jogo inteiro é a pasta public/; hospedagens que esperam "saída estática" (out/) publicam essa cópia.
// Sem efeito na plataforma Sites: ela usa dist/ e ignora out/.
import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public"), target = join(root, "out");
if (!existsSync(join(source, "index.html"))) { console.error("static-out: public/index.html não encontrado"); process.exit(1); }
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log("Cópia estática do jogo em out/");
