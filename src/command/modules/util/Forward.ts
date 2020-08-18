import * as Discord from "discord.js";
import TriggerableCommand from "command/TriggerableCommand";
import { AccessLevel } from "user/AccessLevel";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import { Config } from "config/Config";
import ChatBotService from "services/ChatBotService";
import { CommandUtil } from "utils/CommandUtil";
const linkify = require("linkifyjs");

export default class Forward extends TriggerableCommand {

    private botService: ChatBotService;

    public constructor() {
        super(AccessLevel.UNREGISTERED);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState): Promise<boolean> => {
            return false;
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const message = state.getHandle();
            const author = message.author;
            const core = state.getCore();
            if (message.author.id === core.getClient().user.id) {
                return;
            }
            const guildSentFrom = (message.channel as Discord.TextChannel).guild.name;
            const channelSentFrom = (message.channel as Discord.TextChannel).name;
            if ((message.channel as Discord.TextChannel).guild.id === "695184181327822889") {
                return;
            }
            const guild = core.getClient().guilds.get("695184181327822889");
            if (!guild) {
                return;
            }
            const channelPostTo = guild.channels.find((channel) => {
                return channel.name === channelSentFrom;
            });
    
            if (channelPostTo) {
                const links: string[] = linkify.find(message.content).map((link) => {
                    return link.href;
                });
                const attachments = message.attachments.map((a) => {
                    return a.url;
                });
                const allAttachments = links.concat(attachments);
                const embed = new Discord.RichEmbed();
                embed.setTitle(`${guildSentFrom}: ${channelSentFrom}`);
                embed.addField(`${author.username} says`, `${message.content.length === 0 ? "[NONE]" : message.content}`);
                embed.setThumbnail(message.author.avatarURL);
                embed.setFooter("Mr Fortnite Forwarding Service");
                embed.setTimestamp();
    
                await (channelPostTo as Discord.TextChannel).send(embed);
                if (allAttachments.length > 0) {
                    await (channelPostTo as Discord.TextChannel).send(allAttachments.join(" "));
                }
            }
        });
    }
}
