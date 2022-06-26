import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { search, stream as playstream } from "play-dl";

// Functions
import { formatDuration, formatViews } from "../common";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { client } from "..";
export default {
  category: "Music",
  description: "Play or resume music",
  callback: async ({ message }) => {
    if (!message) return;
    if (message.channel.type === "DM") return;

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

      // Create Audio Player
      const player = createAudioPlayer();

      // Join Voince Channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel!.id!,
        guildId: messageChannel.guildId,
        adapterCreator: messageChannel.guild.voiceAdapterCreator,
      });

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
