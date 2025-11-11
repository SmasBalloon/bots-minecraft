# Bot Discord Minecraft 🤖

Un bot Discord écrit en **TypeScript** avec **Discord.js** pour gérer votre serveur Minecraft.

## 📋 Fonctionnalités

- **Slash Commands** (`/start`) pour démarrer le serveur Minecraft
- **Messages** avec commande `!ping` pour tester le bot
- Chargement automatique des commandes depuis le dossier `slashcommande/`
- Architecture modulaire et extensible

## 🛠️ Technologies

- **Node.js** v20+
- **TypeScript** v5.9+
- **Discord.js** v14.24+
- **Dotenv** v17.2+ pour les variables d'environnement

## 📦 Installation

### 1. Cloner ou initialiser le projet

```bash
cd /root/bots
npm install
```

### 2. Configuration du `.env`

Créez un fichier `.env` à la racine du projet :

```env
TOKEN=votre_token_bot
CLIENT_ID=votre_client_id
```

**Comment obtenir ces valeurs :**

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Allez dans **Bot** → **Copy Token** → Collez dans `TOKEN`
4. Allez dans **General Information** → Copiez **APPLICATION ID** → Collez dans `CLIENT_ID`
5. Assurez-vous que les **Privileged Gateway Intents** sont activés :
   - ✅ MESSAGE CONTENT INTENT
   - ✅ SERVER MEMBERS INTENT (optionnel)

## 🚀 Démarrage

### Mode développement (avec ts-node)

```bash
npm run dev
```

Cela exécute le bot avec TypeScript directement.

### Mode production (compilé)

```bash
# Compiler le TypeScript en JavaScript
npm run build

# Lancer le bot compilé
npm start
```

## 📝 Déploiement des commandes

**Important :** Vous devez déployer les commandes une fois avant de pouvoir les utiliser dans Discord.

```bash
node --loader ts-node/esm deployCommande.ts
```

Vous devriez voir :
```
✓ Commande chargée : start
🚀 Déploiement de 1 commande(s)...
✅ Commandes enregistrées !
```

## 📁 Structure du projet

```
/root/bots/
├── index.ts              # Point d'entrée principal du bot
├── deployCommande.ts     # Script pour déployer les commandes
├── package.json          # Configuration npm
├── tsconfig.json         # Configuration TypeScript
├── .env                  # Variables d'environnement (non versionné)
└── slashcommande/        # Dossier des commandes slash
    └── start.ts          # Commande /start
```

## 💻 Commandes disponibles

### `/start`
Démarre le serveur Minecraft Fabric.

**Usage :** `/start`

**Réponse :** Message privé confirming le démarrage du serveur.

### `!ping` (Message)
Répond avec "Pong" - pour tester que le bot fonctionne.

## ➕ Ajouter une nouvelle commande

### 1. Créer un fichier dans `slashcommande/`

Exemple : `slashcommande/stop.ts`

```typescript
import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export const stopServer = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Arrête le serveur Minecraft");

export default stopServer;

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: "⏳ Arrêt du serveur en cours...",
    ephemeral: true
  });

  // Ajouter votre logique ici
  console.log("Serveur arrêté !");
}
```

### 2. Déployer les commandes

```bash
node --loader ts-node/esm deployCommande.ts
```

### 3. Redémarrer le bot

```bash
npm run dev
```

La nouvelle commande `/stop` sera automatiquement chargée et disponible dans Discord ! 🎉

## 🔧 Configuration avancée

### TypeScript (`tsconfig.json`)

- `target`: ES2020
- `module`: ESNext (modules ECMAScript)
- `moduleResolution`: node
- `strict`: true (mode strict activé)
- `verbatimModuleSyntax`: true

### Package.json

- `type`: "module" (force les modules ES au lieu de CommonJS)
- Scripts disponibles :
  - `npm run dev` - Lancer en développement
  - `npm run build` - Compiler en JavaScript
  - `npm start` - Lancer la version compilée

## 🐛 Dépannage

### Les commandes slash n'apparaissent pas dans Discord

1. Assurez-vous d'avoir lancé le déploiement :
   ```bash
   node --loader ts-node/esm deployCommande.ts
   ```

2. Rechargez Discord (Ctrl+R)

3. Vérifiez que le `CLIENT_ID` dans `.env` est correct

4. Assurez-vous que le bot a les permissions sur le serveur

### Erreur "Used disallowed intents"

Allez sur le [Discord Developer Portal](https://discord.com/developers/applications) et activez les **Privileged Gateway Intents** pour votre application.

### Le bot ne répond pas aux commandes

1. Vérifiez que le bot est en ligne (connecté)
2. Consultez les logs du terminal pour les erreurs
3. Assurez-vous que le TOKEN est correct dans `.env`

## 📚 Ressources utiles

- [Discord.js Documentation](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [TypeScript Documentation](https://www.typescriptlang.org)

## 📄 Licence

Ce projet est libre d'utilisation.

## 👤 Auteur

Développé avec TypeScript et Discord.js

---

**Questions ?** Consultez les logs du terminal avec `npm run dev` pour plus de détails sur les erreurs.
