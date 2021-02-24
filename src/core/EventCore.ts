import * as Discord from "discord.js";
import * as winston from "winston";
import Logger from "log/Logger";
import NikkuCore from "core/NikkuCore";
import OnMessageState from "state/OnMessageState";
import CommandManager from "managers/CommandManager";
import { MathUtil } from "math/MathUtil";

export default class EventCore {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    /**
     * Main interface with Discord.js
     */
    private client: Discord.Client;

    private core: NikkuCore;

    /**
     * @classdesc Class for handling events.
     * @param core - The main bot core.
     */
    public constructor(core: NikkuCore) {
        this.client = core.getClient();
        this.core = core;
        this.logger.debug("Event Core created.");
    }

    /**
     * Begin listening for channel messages.
     */
    public listenMessages(): void {
        this.client.on("message", (message: Discord.Message) => {
            if (!message.author.bot) {
                this.core.getManager(CommandManager).parseLine(message.content,
                    message.author.id, new OnMessageState(this.core, message));
            }
        });
        this.client.on("messageReactionAdd", async (reaction) => {
            if (reaction.emoji.name === "PogChamp") {
                const message = reaction.message;
                setTimeout(async () => {
                    await message.react(reaction.emoji.id);
                }, MathUtil.randInt(0, 60) * 1000)
            }
        })
        this.client.on("messageReactionRemove", async (reaction) => {
            const react = reaction.message.reactions.get(`PogChamp:${process.env.POG_EMOJI_ID || "414252950677094401"}`);
            const users = react && react.users;
            if (users && users.array().length === 1) {
                await reaction.remove(users.get(this.client.user.id));
            }
        })
    }

    public handleGuildRegistration(): void {
        this.client.on("guildCreate", (guild) => {
            this.logger.verbose(`Joined new server "${guild.name}".`);
        });

        this.client.on("guildDelete", (guild) => {
            this.logger.verbose(`Left server "${guild.name}".`);
        });
    }
}
