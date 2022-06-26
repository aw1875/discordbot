import { getVoiceConnection } from "@discordjs/voice";
import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { player } from "../index";

export default {
  category: "Music",
  description: "Pause music",
  callback: async ({ message }) => {
    if (!message) return;
    if (message.channel.type === "DM") return;
    if (player.state.status !== "playing") return;

    // Get Voice Channel and Message Channel
    const voiceChannel = message.member?.voice.channel;
    const messageChannel = message.channel;

    if (!voiceChannel) {
      const embed = new MessageEmbed()
        .setColor("#000000")
        .addField("Error", "Please join a voice channel first", false);

      message.reply({
        embeds: [embed],
      });

      return;
    }

    // Pause music
    player.pause();

    // Send status update
    const embed = new MessageEmbed()
      .setColor("#f3ab3f")
      .addField("Status", "Player has paused the song");

    messageChannel.send({
      embeds: [embed],
    });

    // Turn speaking off
    getVoiceConnection(message.guildId!)?.setSpeaking(false);
  },
} as ICommand;
