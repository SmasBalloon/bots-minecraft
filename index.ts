import { Client, GatewayIntentBits, Collection } from 'discord.js';
import type { Interaction, Message } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as any;

// Créer une collection pour les commandes
client.commands = new Collection();

// Charger les slash commands
const commandsDir = join(__dirname, 'slashcommande');
console.log(`📂 Dossier des commandes : ${commandsDir}`);

const commandFiles = readdirSync(commandsDir).filter(
  (file) => extname(file) === '.ts' || extname(file) === '.js'
);

console.log(`📄 Fichiers trouvés : ${commandFiles.join(', ')}`);

for (const file of commandFiles) {
  const commandPath = join(commandsDir, file);
  try {
    const command = await import(`file://${commandPath}`);

    const commandBuilder = command.default || Object.values(command)[0];
    if (commandBuilder && typeof commandBuilder.toJSON === 'function') {
      const name = commandBuilder.name || commandBuilder.toJSON().name;
      client.commands.set(name, commandBuilder);
      console.log(`✓ Commande chargée : ${name}`);
    }
  } catch (error) {
    console.error(`❌ Erreur en chargeant ${file}:`, error);
  }
}

client.once('clientReady', () => {
  console.log(`✅ Connecté en tant que ${client.user?.tag}`);
  console.log(`📝 ${client.commands.size} commande(s) chargée(s)`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Commande non trouvée : ${interaction.commandName}`);
    return;
  }

  try {
    console.log(`⚡ Commande exécutée : /${interaction.commandName}`);

    // Importer le module pour exécuter la fonction execute
    const commandModule = await import(`file://${join(__dirname, 'slashcommande', `${interaction.commandName}.ts`)}`);
    const execute = commandModule.execute;

    if (execute && typeof execute === 'function') {
      await execute(interaction);
    } else {
      await interaction.reply({
        content: '✅ Commande exécutée !',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de la commande :`, error);
    await interaction.reply({
      content: '❌ Une erreur est survenue !',
      ephemeral: true
    });
  }
});

client.on('messageCreate', (message: Message) => {
  if (message.content === '!ping') {
    message.reply('🏓 Pong en TypeScript!');
  }
});

client.login(process.env.TOKEN);
