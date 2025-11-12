import { Client, GatewayIntentBits, Collection } from 'discord.js';
import type { Interaction, Message } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

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

const commandFiles = readdirSync(commandsDir).filter(
  (file) => extname(file) === '.ts' || extname(file) === '.js'
);

for (const file of commandFiles) {
  const commandPath = join(commandsDir, file);
  try {
    const command = await import(`file://${commandPath}`);

    const commandBuilder = command.default || Object.values(command)[0];
    if (commandBuilder && typeof commandBuilder.toJSON === 'function') {
      const name = commandBuilder.name || commandBuilder.toJSON().name;
      client.commands.set(name, commandBuilder);
    }
  } catch (error) {
    console.error(`❌ Erreur en chargeant ${file}:`, error);
  }
}

client.once('clientReady', () => {
  console.log(`✅ Connecté en tant que ${client.user?.tag}`);
  console.log(`📝 ${client.commands.size} commande(s) chargée(s)`);

  // Fonction pour vérifier l'état du serveur et mettre à jour le statut
  function updateServerStatus() {
    // activités disponibles (valeur par défaut pendant la vérification)
    let activities: { name: string; type: number }[] = [
      { name: 'Vérification du serveur...', type: 3 },
    ];

    // Vérifier l'état du service de manière asynchrone et mettre à jour la liste d'activités
    exec('systemctl is-active fabric', (error, stdout) => {
      const isActive = !error && stdout?.toString().trim() === 'active';
      if (isActive) {
        activities = [
          { name: 'Serveur en ligne', type: 1 },
          { name: '/stop pour arrêter', type: 0 },
        ];
      } else {
        activities = [
          { name: 'Serveur éteint', type: 2 },
          { name: '/start pour démarrer', type: 0 },
        ];
      }

      let activityIndex = 0;

      // Définir la première activité
      updatePresence();

      // Changer d'activité toutes les 15 secondes (seulement pendant cette minute)
      const presenceInterval = setInterval(updatePresence, 15000);

      function updatePresence() {
        const activity = activities[activityIndex] || activities[0];
        client.user?.setPresence({
          activities: [activity],
          status: 'online',
        });
        activityIndex = (activityIndex + 1) % activities.length;
      }

      // Arrêter l'intervalle après 60 secondes pour réinitialiser complètement
      setTimeout(() => {
        clearInterval(presenceInterval);
      }, 60000);
    });
  }

  // Mettre à jour le statut immédiatement
  updateServerStatus();

  // Réinitialiser et vérifier l'état du serveur toutes les minutes
  setInterval(updateServerStatus, 60000); // 60000 ms = 1 minute
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
