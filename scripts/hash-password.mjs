import { randomBytes, scryptSync } from "crypto";

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run admin:hash-password -- \"minha-senha-forte\"");
  process.exit(1);
}

if (password.length < 8) {
  console.error("A senha deve ter pelo menos 8 caracteres.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log("\nAdicione esta linha ao seu .env (substitua ADMIN_PASSWORD_HASH existente):\n");
console.log(`ADMIN_PASSWORD_HASH="${salt}:${hash}"\n`);
