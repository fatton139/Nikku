import * as Discord from "discord.js";
import * as winston from "winston";
import Logger from "log/Logger";
import NikkuCore from "core/NikkuCore";
import OnMessageState from "state/OnMessageState";
import CommandManager from "managers/CommandManager";

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
            if (reaction.emoji.name === "PogChamp" && !reaction.me) {
                const message = reaction.message;
                await message.react(reaction.emoji.id);
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
