import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { Rcon } from "rcon-client";

export const sayCommand = new SlashCommandBuilder()
  .setName("say")
  .setDescription("Envoie un message sur le serveur Minecraft");
  sayCommand.addStringOption(option =>
    option
      .setName("message")
      .setDescription("Message à envoyer sur le serveur Minecraft")
      .setRequired(true)
);

const SayCommand = sayCommand;

export default SayCommand;

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

    const message = interaction.options.getString("message");

    // Répondre immédiatement à l'interaction
    await interaction.reply({
      content: `⏳ Envoi du message sur le serveur Minecraft en cours...`,
      ephemeral: true
    });
    // Connexion RCON
    try {
      const rcon = await Rcon.connect({
        host: process.env.RCON_HOST || "localhost",
        port: 25575,
        password: process.env.RCON_PASSWORD || "",
      });

      // Envoyer la commande kill
      const response = await rcon.send(`say ${message}`);

      await interaction.editReply({
        content: `✅ Le message **${message}** a été envoyé sur le serveur !`
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