import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { Rcon } from "rcon-client";

export const killServer = new SlashCommandBuilder()
  .setName("kill")
  .setDescription("Tue un joueur du serveur Minecraft");
killServer.addStringOption(option =>
  option
    .setName("pseudo")
    .setDescription("Pseudo du joueur (in game) à tuer")
    .setRequired(true)
);

const KillMe = killServer;

export default KillMe;

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const roleId = "1438248783371702282";
    const requiredRole = interaction.guild?.roles.cache.get(roleId);

    // Vérifier si l'utilisateur a le rôle
    const member = interaction.member as any;

    if (!member || !member.roles) {
      await interaction.reply({
        content: "❌ Impossible de vérifier vos rôles !",
        ephemeral: true
      });
      return;
    }

    if (!member.roles.cache?.has(roleId)) {
      await interaction.reply({
        content: `❌ Vous n'avez pas la permission d'utiliser cette commande ! (Rôle requis: ${requiredRole?.name || "Inconnu"})`,
        ephemeral: true
      });
      return;
    }

    const pseudo = interaction.options.getString("pseudo");

    // Répondre immédiatement à l'interaction
    await interaction.reply({
      content: `⏳ Expulsion de **${pseudo}** en cours...`,
      ephemeral: true
    });
    // Connexion RCON
    try {
      const rcon = await Rcon.connect({
        host: "localhost",
        port: 25575,
        password: "Banane24750@",
      });

      // Envoyer la commande kill
      const response = await rcon.send(`kill ${pseudo}`);

      await interaction.editReply({
        content: `✅ Le joueur **${pseudo}** a été tué sur le serveur !`
      });

      await rcon.end();
    } catch (rconError) {
      console.error("❌ Erreur RCON :", rconError);
      await interaction.editReply({
        content: `❌ Impossible de se connecter au serveur Minecraft (RCON)`
      }).catch(console.error);
    }

  } catch (error) {
    console.error("❌ Erreur lors de l'exécution :", error);
    console.error("Stack:", (error as Error).stack);
    await interaction.editReply({
      content: `❌ Une erreur est survenue ! ${error instanceof Error ? error.message : "Erreur inconnue"}`
    }).catch(console.error);
  }
}