import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { search, stream as playstream } from "play-dl";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";

// Common Functions
import { formatDuration, formatViews } from "../common";
import { player } from "../index";

export default {
  category: "Music",
  description: "Play or resume music",
  callback: async ({ message }) => {
    if (!message) return;
    if (message.channel.type === "DM") return;
    if (player.state.status === "playing") {
      const embed = new MessageEmbed()
        .setColor("#f20000")
        .addField("Error", "Player is already playing a song", true);

      message.reply({
        embeds: [embed],
      });
      return;
    }

    // Get passed in args
    const [, ...args] = message.content.split(" ");

    // Get Voice Channel and Message Channel
    const voiceChannel = message.member?.voice.channel;
    const messageChannel = message.channel;

    if (!voiceChannel) {
      const embed = new MessageEmbed()
        .setColor("#000000")
        .addField("Error", "Please join a voice channel first.", false);

      message.reply({
        embeds: [embed],
      });

      return;
    }

    // Check if player is playing
    if (player.state.status === "paused") {
      player.unpause();

      const embed = new MessageEmbed()
        .setColor("#f3ab3f")
        .addField("Status", "Music player has resumed playing");

      messageChannel.send({
        embeds: [embed],
      });

      return;
    }

    // Get Query
    const query = args.join(" ");

    // Send message updating user
    messageChannel.send(`Searching for **${query}**`);

    // Query not empty
    if (query.length === 0) {
      const embed = new MessageEmbed()
        .setColor("#f20000")
        .addField("Error", "Please include a song name in your search", false);

      message.reply({
        embeds: [embed],
      });

      return;
    }

    // Get Video
    const { url, title, durationInSec, views, thumbnails, channel } =
      await search(query, {
        source: {
          youtube: "video",
        },
      }).then((video) => video[0]);

    if (url) {
      // Create Embed
      const embed = new MessageEmbed()
        .setColor("#f3ab3f")
        .addField("Title", title!, false)
        .addField("Duration", formatDuration(durationInSec), true)
        .addField("Artist", channel!.name!, true)
        .addField("Views", formatViews(views), true)
        .setThumbnail(thumbnails[0].url);

      message.reply({
        embeds: [embed],
      });

      // Get Stream Data
      const { stream, type } = await playstream(url).then((stream) => stream);
      const resource = createAudioResource(stream, {
        inputType: type,
      });

      // Join Voince Channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel!.id!,
        guildId: messageChannel.guildId,
        adapterCreator: messageChannel.guild.voiceAdapterCreator,
      });

      // Subscribe to player and play song
      connection.subscribe(player);
      player.play(resource);
      connection.setSpeaking(true);

      return;
    } else {
      messageChannel.send(
        `Could not find any videos with the title **${query}**`
      );
    }
  },
} as ICommand;
