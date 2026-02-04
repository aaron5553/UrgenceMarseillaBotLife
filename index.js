// Charger les variables d'environnement depuis .env ou Railway
require('dotenv').config();

const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');

// Création du client Discord avec les intents nécessaires
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // --- Commande !setup pour configurer tout le serveur ---
  if (message.content === "!setup") {
    const guild = message.guild;

    // --- Rôle général Staff ---
    const generalStaff = [{ name: "Staff de Urgence Marseilla", color: "Purple" }];
    for (const r of generalStaff) {
      if (!guild.roles.cache.find(role => role.name === r.name)) {
        await guild.roles.create(r);
      }
    }

    // --- Tous les rôles Staff détaillés ---
    const staffRoles = [
      { name: "Fonda", color: "Gold" },
      { name: "Co-Fonda", color: "Gold" },
      { name: "Responsable Serveur", color: "DarkRed" },
      { name: "Responsable Staff", color: "DarkRed" },
      { name: "Responsable Admin", color: "DarkRed" },
      { name: "Admin", color: "Red" },
      { name: "Admin Test", color: "Red" },
      { name: "Responsable Modérateurs", color: "Blue" },
      { name: "Modo", color: "Blue" },
      { name: "Modo Test", color: "Blue" },
      { name: "Responsable Support", color: "Green" },
      { name: "Support", color: "Green" },
      { name: "Support Test", color: "Green" }
    ];

    for (const r of staffRoles) {
      if (!guild.roles.cache.find(role => role.name === r.name)) {
        await guild.roles.create(r);
      }
    }

    // --- Rôles Urgence ---
    const urgenceRoles = [
      { name: "🚑 SAMU", color: "Blue" },
      { name: "🚒 Pompier", color: "Red" },
      { name: "👮 Police", color: "DarkBlue" },
      { name: "👤 Citoyen", color: "Grey" }
    ];

    for (const r of urgenceRoles) {
      if (!guild.roles.cache.find(role => role.name === r.name)) {
        await guild.roles.create(r);
      }
    }

    // --- Catégorie principale ---
    let categorie = guild.channels.cache.find(c => c.name === "🚨 URGENCE MARSEILLA" && c.type === ChannelType.GuildCategory);
    if (!categorie) {
      categorie = await guild.channels.create({
        name: "🚨 URGENCE MARSEILLA",
        type: ChannelType.GuildCategory
      });
    }

    // --- Salons ---
    const salons = [
      { name: "📜-règlement", type: ChannelType.GuildText },
      { name: "📝-whitelist", type: ChannelType.GuildText },
      { name: "💬-général", type: ChannelType.GuildText },
      { name: "📢-annonces", type: ChannelType.GuildText },
      { name: "🎫-tickets", type: ChannelType.GuildText }
    ];

    for (const s of salons) {
      if (!guild.channels.cache.find(c => c.name === s.name)) {
        await guild.channels.create({ ...s, parent: categorie.id });
      }
    }

    message.channel.send("✅ Serveur Urgence Marseilla configuré avec tous les rôles Staff et Urgence !");
  }

  // --- Commande whitelist ---
  if (message.content.startsWith("!wl")) {
    const args = message.content.split(" ");
    const id = args[1];
    if (!id) return message.reply("❌ Donne un ID FiveM");
    message.channel.send(`📋 Nouvelle demande whitelist : ID ${id}`);
  }
});

// --- Connexion sécurisée via token depuis .env ou Environment Variables ---
client.login(process.env.TOKEN);
