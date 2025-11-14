import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { Rcon } from "rcon-client";

export const listPlayers = new SlashCommandBuilder()
  .setName("listplayers")
  .setDescription("Liste les joueurs connectés au serveur Minecraft");

const ListPlayers = listPlayers;

export default ListPlayers;

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const roleId = "1438248783371702282";
    const requiredRole = interaction.guild?.roles.cache.get(roleId);

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

    await interaction.reply({
      content: `⏳ Récupération de la liste des joueurs...`,
      ephemeral: true
    });

    try {
      const rcon = await Rcon.connect({
        host: "localhost",
        port: 25575,
        password: "Banane24750@",
      });

      const response = await rcon.send(`list`);

      await interaction.editReply({
        content: `✅ **Joueurs connectés:**\n\`\`\`\n${response}\n\`\`\``
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
    await interaction.editReply({
      content: `❌ Une erreur est survenue ! ${error instanceof Error ? error.message : "Erreur inconnue"}`
    }).catch(console.error);
  }
}
