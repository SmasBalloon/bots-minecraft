# 🎮 Bot Discord Minecraft

> Un bot Discord puissant et moderne pour gérer votre serveur Minecraft directement depuis Discord !

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.24+-5865F2)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

## ✨ Fonctionnalités

- 🚀 **Commandes Slash** - `/start` pour démarrer votre serveur Minecraft
- 🔧 **Architecture modulaire** - Ajoutez des commandes facilement
- ⚡ **Chargement automatique** - Les commandes se chargent automatiquement
- 🎯 **TypeScript** - Code sécurisé et maintenable
- 💬 **Messages texte** - Commande `!ping` pour tester le bot

## 🛠️ Technologies

- **Node.js** v20+
- **TypeScript** v5.9+
- **Discord.js** v14.24+
- **Dotenv** v17.2+ pour les variables d'environnement

## ⚙️ Prérequis

- Node.js v20 ou supérieur
- npm ou yarn
- Un bot Discord créé sur le [Discord Developer Portal](https://discord.com/developers/applications)
- Token du bot et Client ID

## 📦 Installation et Configuration

### 1️⃣ Installer les dépendances

```bash
npm install
```

### 2️⃣ Configurer le `.env`

Créez un fichier `.env` à la racine du projet :

```env
TOKEN=votre_token_bot
CLIENT_ID=votre_client_id
```

### 3️⃣ Obtenir vos identifiants Discord

1. 🔗 Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. ➕ Cliquez sur **"New Application"**
3. 📝 Donnez un nom à votre bot
4. 🔑 Allez dans l'onglet **"Bot"**
   - Cliquez sur **"Add Bot"**
   - Cliquez sur **"Copy"** sous le token → Collez dans `TOKEN`
5. 📋 Allez dans **"General Information"**
   - Copiez l'**APPLICATION ID** → Collez dans `CLIENT_ID`
6. ⚙️ Assurez-vous que les **Privileged Gateway Intents** sont activés :
   - ✅ **MESSAGE CONTENT INTENT**
   - ✅ **SERVER MEMBERS INTENT** (optionnel)

### 4️⃣ Inviter le bot sur votre serveur

1. Allez dans **OAuth2** → **URL Generator**
2. Sélectionnez les scopes :
   - ✅ `bot`
   - ✅ `applications.commands`
3. Sélectionnez les permissions :
   - ✅ Send Messages
   - ✅ Read Messages/View Channels
4. Copiez l'URL générée et ouvrez-la dans votre navigateur

## 🚀 Démarrage rapide

### Mode développement (Recommandé)

```bash
npm run dev
```

Cela exécute le bot avec TypeScript et hot-reload.

### Mode production

```bash
# 1. Compiler le TypeScript en JavaScript
npm run build

# 2. Lancer le bot compilé
npm start
```

### � Déployer les commandes slash

**Important :** Lancez ceci une fois avant de pouvoir utiliser les commandes dans Discord.

```bash
node --loader ts-node/esm deployCommande.ts
```

**Sortie attendue :**
```
✓ Commande chargée : start
🚀 Déploiement de 1 commande(s)...
✅ Commandes enregistrées !
```

## � Scripts npm disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | 🚀 Lancer le bot en mode développement |
| `npm run build` | 📦 Compiler TypeScript en JavaScript |
| `npm start` | ▶️ Lancer le bot compilé |

## �📁 Structure du projet

```
bots-minecraft/
├── 📄 index.ts                    # Point d'entrée principal du bot
├── 📄 deployCommande.ts           # Script de déploiement des commandes
├── 📄 package.json                # Configuration npm
├── 📄 tsconfig.json               # Configuration TypeScript
├── 📄 .env                        # Variables d'environnement (à créer)
├── 📄 README.md                   # Ce fichier
├── 📂 slashcommande/              # Dossier des commandes slash
│   └── 📄 start.ts                # Commande /start
├── 📂 dist/                       # Code compilé (généré après build)
└── 📂 node_modules/               # Dépendances npm
```

## � Commandes disponibles

### `/start` - Démarrer le serveur Minecraft

```
/start
```

- 📝 **Description :** Démarre le serveur Minecraft Fabric
- 🎯 **Réponse :** Message privé confirmant le démarrage
- ⏳ **Durée :** Quelques secondes

### `!ping` - Tester le bot

```
!ping
```

- 📝 **Description :** Vérifie que le bot répond
- 🎯 **Réponse :** "🏓 Pong en TypeScript!"

## ➕ Créer une nouvelle commande

### 📄 Étape 1 : Créer le fichier

Créez un nouveau fichier dans le dossier `slashcommande/`, par exemple `slashcommande/restart.ts` :

```typescript
import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

// Définir la commande slash
export const restartServer = new SlashCommandBuilder()
  .setName("restart")
  .setDescription("Redémarre le serveur Minecraft");

export default restartServer;

// Fonction d'exécution
export async function execute(interaction: ChatInputCommandInteraction) {
  // Répondre immédiatement à l'utilisateur
  await interaction.reply({
    content: "⏳ Redémarrage du serveur en cours...",
    ephemeral: true  // Message privé
  });

  // Ajouter votre logique ici
  try {
    // Exemple : redémarrer le serveur
    console.log("🔄 Redémarrage du serveur...");
    
    // Mettre à jour la réponse
    await interaction.editReply({
      content: "✅ Serveur redémarré avec succès !"
    });
  } catch (error) {
    await interaction.editReply({
      content: "❌ Erreur lors du redémarrage !"
    });
  }
}
```

### 🚀 Étape 2 : Déployer la commande

```bash
node --loader ts-node/esm deployCommande.ts
```

### 🔄 Étape 3 : Redémarrer le bot

```bash
npm run dev
```

La commande `/restart` est maintenant disponible ! 🎉

## 🔧 Configuration avancée

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "verbatimModuleSyntax": true
  },
  "ts-node": {
    "esm": true,
    "experimentalEsm": true
  }
}
```

### Variables d'environnement (`.env`)

```env
# Token de votre bot (à garder secret !)
TOKEN=votre_token_ici

# ID de votre application Discord
CLIENT_ID=votre_client_id_ici
```

⚠️ **Important :** Ne partagez JAMAIS votre TOKEN !

## ❓ FAQ et Dépannage

### ❌ Les commandes slash n'apparaissent pas

**Solution :**
1. Lancez le déploiement : `node --loader ts-node/esm deployCommande.ts`
2. Rechargez Discord : <kbd>Ctrl</kbd> + <kbd>R</kbd> (Windows/Linux) ou <kbd>Cmd</kbd> + <kbd>R</kbd> (Mac)
3. Attendez 15-30 secondes
4. Tapez `/` dans le canal

### ❌ Erreur "Used disallowed intents"

**Solution :**
1. 🔗 Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Sélectionnez votre bot
3. Allez dans **Bot** → **Privileged Gateway Intents**
4. Activez ✅ **MESSAGE CONTENT INTENT**
5. Sauvegardez et redémarrez le bot

### ❌ Bot offline ou ne répond pas

**Solution :**
1. Vérifiez le TOKEN dans `.env`
2. Vérifiez le CLIENT_ID dans `.env`
3. Consultez les logs : `npm run dev`
4. Assurez-vous que le bot a les permissions sur le serveur
5. Redémarrez le bot : <kbd>Ctrl</kbd> + <kbd>C</kbd> puis `npm run dev`

### ❌ Erreur "Cannot find module"

**Solution :**
```bash
# Réinstallez les dépendances
rm -rf node_modules
npm install
```

### ❌ Commande ne s'exécute pas

1. Vérifiez que la commande a été déployée
2. Vérifiez les logs du terminal pour les erreurs
3. Assurez-vous que la fonction `execute()` existe dans le fichier de la commande
4. Vérifiez que le bot a les permissions nécessaires

## 📚 Ressources utiles

| Ressource | Lien |
|-----------|------|
| 📖 Discord.js Docs | https://discord.js.org |
| 🔧 Developer Portal | https://discord.com/developers/applications |
| 💙 TypeScript | https://www.typescriptlang.org |
| 🟢 Node.js | https://nodejs.org |

## � Licence

Ce projet est sous licence MIT - Libre d'utilisation.

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
- Ouvrir des issues pour signaler des bugs
- Créer des pull requests pour ajouter des fonctionnalités
- Suggérer des améliorations

## 💡 Conseils pour aller plus loin

- 📚 Consultez la [documentation Discord.js](https://discord.js.org)
- 🎨 Personnalisez les emojis et les messages
- 🔐 Utilisez les permissions Discord pour sécuriser les commandes
- 📊 Ajoutez la sauvegarde des données
- 🌐 Intégrez une base de données (MongoDB, PostgreSQL, etc.)

---

**Besoin d'aide ?** 
- 📖 Consultez les logs : `npm run dev`
- 🐛 Vérifiez la section [FAQ et Dépannage](#-faq-et-dépannage)
- 💬 Ouvrez une issue sur GitHub

**Développé avec ❤️ en TypeScript et Discord.js**
