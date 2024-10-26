const { } = require("./keep_alive");
const { Client, GatewayIntentBits, Events, EmbedBuilder, ActivityType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const TOKEN = 'MTI5ODU0MDM5NTU0NTc1NTY5MA.GlAoCt.svqxbj3LVF2N-K8aYB_9C3-yVc0NQ1JuvI9bfs'; // Replace with your bot token
const CHANNEL_ID = '1289430797702660194'; // Replace with your channel ID

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set bot presence
    client.user.setPresence({
        activities: [{ name: 'Fear The Agony', type: ActivityType.Playing }],
        status: 'online',
    });

    // Register commands
    const commands = client.application.commands;

    await commands.create({
        name: 'help',
        description: 'List available commands',
    });

    await commands.create({
        name: 'ping',
        description: 'Responds with Pong!',
    });

    await commands.create({
        name: 'poll',
        description: 'Create a poll with a question and two options',
        options: [
            {
                name: 'question',
                type: 3, // STRING type
                description: 'The question for the poll',
                required: true,
            },
            {
                name: 'option1',
                type: 3, // STRING type
                description: 'First option for the poll',
                required: true,
            },
            {
                name: 'option2',
                type: 3, // STRING type
                description: 'Second option for the poll',
                required: true,
            },
        ],
    });
});

// Welcome message for new members
client.on(Events.GuildMemberAdd, (member) => {
    const channel = member.guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`Welcome ${member} to FTA! Make sure to read over our rules and requirements.

        |<#1289441984456560691>
        |<#1289441984456560691>
        |<#1289452748126945371>

        If trying to apply for the team, make sure to check the announcements!
        -------------
        #FearFTA`)
        .setImage('https://cdn.discordapp.com/attachments/1290155176837124151/1294904209828872202/Welcome.jpeg');

    channel.send({ embeds: [embed] });
});

// Respond to messages
client.on(Events.MessageCreate, (message) => {
    if (message.content.toLowerCase() === 'ping') {
        message.channel.send('Pong!');
    }
});

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

    if (command === 'help') {
        await interaction.reply('Here are the available commands:\n/help - List available commands\n/ping - Responds with Pong!\n/poll - Create a poll with a question and two options');
    } else if (command === 'ping') {
        await interaction.reply('Pong!');
    } else if (command === 'poll') {
        const question = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');

        const pollEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Poll')
            .setDescription(`**${question}**\n\n1️⃣ ${option1}\n2️⃣ ${option2}`)
            .setFooter({ text: 'React with 1️⃣ or 2️⃣ to vote!' });

        const pollMessage = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        // Add reactions for voting
        await pollMessage.react('1️⃣');
        await pollMessage.react('2️⃣');
    }
});

// Login to Discord with your bot's token
client.login(TOKEN);