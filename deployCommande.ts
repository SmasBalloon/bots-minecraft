import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandsDir = join(__dirname, "slashcommande");

console.log(`📂 Dossier des commandes : ${commandsDir}`);

// Charger toutes les commandes du dossier slashcommande
const commands: any[] = [];
const commandFiles = readdirSync(commandsDir).filter(
  (file) => extname(file) === ".ts" || extname(file) === ".js"
);

console.log(`📄 Fichiers trouvés : ${commandFiles.join(", ")}`);

for (const file of commandFiles) {
  const commandPath = join(commandsDir, file);
  try {
    const command = await import(`file://${commandPath}`);

    // Chercher l'export par défaut ou la première export
    const commandBuilder = command.default || Object.values(command)[0];

    if (commandBuilder && typeof commandBuilder.toJSON === "function") {
      const commandData = commandBuilder.toJSON();
      commands.push(commandData);
      console.log(`✓ Commande chargée : ${commandData.name}`);
    }
  } catch (error) {
    console.error(`❌ Erreur en chargeant ${file}:`, error);
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log(`🚀 Déploiement de ${commands.length} commande(s)...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("✅ Commandes enregistrées !");
  } catch (error) {
    console.error("❌ Erreur :", error);
  }
})();