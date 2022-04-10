require('dotenv').config()

const { Client, Intents } = require('discord.js');
const client = new Client({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]});

const ai = require('./AI');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
})

let convos = {};
let reseters = {};

function reset(userId) {
  convos[userId] = "";
  console.log("resetted");
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return false;

  if (message.content.slice(0, 6) == "/reset") {
    if (reseters[message.author.id]) {
      clearInterval(reseters[message.author.id]);
    }
    reset(message.author.id);
    return false;
  }

  if (message.content.slice(0, 1) == "/") return false;

  if (message.type == "CHANNEL_PINNED_MESSAGE") return false;

  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  //if (message.mentions.has(client.user.id)) {

    if (convos[message.author.id]) {
      clearInterval(reseters[message.author.id]);
      reseters[message.author.id] = setInterval(() => reset(message.author.id), 30 * 1000);
      convos[message.author.id] += "Q:\n" + message.content + "\n\n";
    } else {
      convos[message.author.id] = "\n\nQ:\n" + message.content + "\n\n";
      reseters[message.author.id] = setInterval(() => reset(message.author.id), 30 * 1000);
    }

    //try {
      ai(convos[message.author.id]).then(function (response) {
          let answer = response.data.choices[0].text;
          convos[message.author.id] += answer;

          if (answer.replace("A:", "").length > 0) {
            message.reply(answer.replace("A:", ""));
          }
        })
    //} catch(e) {
     // message.reply("Got an error. Most likely went over the message limit. Resetting your message history...");
     // reset(message.author.id);
    //}

    // message.reply(convos[message.author.id]);

    /*
    ai(message.content + "\n\n###\n\n").then(function (response) {
        message.reply(response.data.choices[0].text);
      })
    */
  //}
});

client.login(process.env.DISCORD_BOT_TOKEN_LONG)
