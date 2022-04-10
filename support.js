require('dotenv').config()

const { Client, Intents } = require('discord.js');
const client = new Client({
  intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"],
  partials: ['CHANNEL']
});

const ai = require('./AI');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
})

let previousQuestion = {};
let reseters = {};

function reset(userId) {
  delete previousQuestion[userId];
}

client.on("messageCreate", (message) => {

  if (message.author.bot) return false;

  if (message.type == "CHANNEL_PINNED_MESSAGE") return false;

  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  if (message.channel.type == "DM") {

    const prompt = message.content.replace(/(?:\r\n|\r|\n)/g, ' ') + " ->";
    let currentQuestion;

    if (previousQuestion[message.author.id]) {
      currentQuestion = previousQuestion[message.author.id] + "\n" + prompt;
      clearInterval(reseters[message.author.id]);
      reseters[message.author.id] = setInterval(() => reset(message.author.id), 120 * 1000);

    } else {
      currentQuestion = "The following is a support chatbot for Example Inc.\n\n" + prompt;
      reseters[message.author.id] = setInterval(() => reset(message.author.id), 120 * 1000);
    }

    ai(currentQuestion).then(function (response) {
      let answer = response.data.choices[0].text;
      previousQuestion[message.author.id] = prompt + answer;

      if (answer.length > 0) {
        message.reply(answer);
      }

    })
  }
});

client.login(process.env.DISCORD_BOT_TOKEN_SUPPORT)
