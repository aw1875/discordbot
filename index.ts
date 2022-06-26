require("dotenv").config();
import { Client } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import { createAudioPlayer } from "@discordjs/voice";

export const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
  partials: ["CHANNEL"],
});

client.on("ready", () => {
  console.log(`Bot logged in as ${client.user?.username}!`);
  client.user?.setActivity({
    type: "WATCHING",
    name: "aWxlfy on Twitch",
  });

  new WOKCommands(client, {
    commandDir: path.join(__dirname, "commands"),
    ignoreBots: true,
    typeScript: true,
  });
});

// Create Audio Player
export const player = createAudioPlayer();

(async () => {
  client.login(process.env.BOT_TOKEN);
})();
