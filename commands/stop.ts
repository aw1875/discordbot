import { getVoiceConnection } from "@discordjs/voice";
import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { player } from "..";

export default {
  category: "Music",
  description: "Stop Music Player",
  callback: async ({ message }) => {
    if (!message) return;
    if (message.channel.type === "DM") return;

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

    // Send status
    const embed = new MessageEmbed()
      .setColor("#f3ab3f")
      .addField("Status", "Music has stopped, goodbye!");

    messageChannel.send({
      embeds: [embed],
    });

    // Stop Music and leave call
    player.stop();
    getVoiceConnection(message.guildId!)?.destroy();
  },
} as ICommand;
