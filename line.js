require('dotenv').config()

const { Client, Intents } = require('discord.js');
const client = new Client({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]});

const ai = require('./AI');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
})

client.on("messageCreate", (message) => {
//  setTimeout ( function () {

  if (message.author.id == client.user.id) return false;
  if (message.content.slice(0, 1) == "/") return false;
  if (message.type == "CHANNEL_PINNED_MESSAGE") return false;
  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  const prompt = message.author.name + ": " + message.content.replace(/(?:\r\n|\r|\n)/g, ' ') + " -> " + process.env.TARGET_NAME + ":";

  ai(prompt).then(function (response) {
    let answer = response.data.choices[0].text;

    if (answer.length > 0) {
      message.reply(answer.slice(0, 1950));
    }
  })

//  }, 10000);

});

client.login(process.env.DISCORD_BOT_TOKEN_LINE)


/*
if (message.content.slice(0, 9) == "/generate") {
  ai("/generate" + " -> " + process.env.TARGET_NAME + ":").then(function (response) {
    let answer = response.data.choices[0].text;

    if (answer.length > 0) {
      message.reply(answer);
    }
  })
  return false;
}
*/
