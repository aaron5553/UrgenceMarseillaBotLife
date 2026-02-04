const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Commande setup
  if (message.content === "!setup") {
    const guild = message.guild;

    // Création rôles
    const roles = [
      { name: "🚑 SAMU", color: "Blue" },
      { name: "🚒 Pompier", color: "Red" },
      { name: "👮 Police", color: "DarkBlue" },
      { name: "👤 Citoyen", color: "Grey" }
    ];

    for (const r of roles) {
      if (!guild.roles.cache.find(role => role.name === r.name)) {
        await guild.roles.create(r);
      }
    }

    // Catégorie
    let categorie = guild.channels.cache.find(c => c.name === "🚨 URGENCE MARSEILLA" && c.type === ChannelType.GuildCategory);
    if (!categorie) {
      categorie = await guild.channels.create({
        name: "🚨 URGENCE MARSEILLA",
        type: ChannelType.GuildCategory
      });
    }

    // Salons
    const salons = [
      { name: "📜-règlement", type: ChannelType.GuildText },
      { name: "📝-whitelist", type: ChannelType.GuildText },
      { name: "💬-général", type: ChannelType.GuildText }
    ];

    for (const s of salons) {
      if (!guild.channels.cache.find(c => c.name === s.name)) {
        await guild.channels.create({ ...s, parent: categorie.id });
      }
    }

    message.channel.send("✅ Serveur Urgence Marseilla configuré !");
  }

  // Commande whitelist
  if (message.content.startsWith("!wl")) {
    const args = message.content.split(" ");
    const id = args[1];
    if (!id) return message.reply("❌ Donne un ID FiveM");
    message.channel.send(`📋 Nouvelle demande whitelist : ID ${id}`);
  }
});

client.login(process.env.TOKEN);
