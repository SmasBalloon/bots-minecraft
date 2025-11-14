import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { exec } from "child_process";

export const stopServer = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Arrête le serveur Minecraft");

export default stopServer;

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.reply({
      content: "⏳ Arrêt du serveur Minecraft en cours...",
      ephemeral: true
    });

    exec("systemctl stop fabric", (error, stdout, stderr) => {
      if (error) {
        interaction.editReply({
          content: `❌ Erreur lors de l'arrêt du serveur : ${error.message}`
        }).catch(console.error);
        return;
      }
      if (stderr) {
        interaction.editReply({
          content: `❌ Erreur : ${stderr}`
        }).catch(console.error);
        return;
      }
      interaction.editReply({
        content: "✅ Serveur Minecraft arrêté avec succès !"
      }).catch(console.error);
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur :", error);
    interaction.editReply({
      content: "❌ Une erreur est survenue !"
    }).catch(console.error);
  }
}