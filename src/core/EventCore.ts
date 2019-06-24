import * as Discord from "discord.js";
import * as winston from "winston";
import { Logger } from "log";
import { NikkuCore, core as coreInstance } from "core";
import OnMessageState from "state/OnMessageState";
import CommandManager from "managers/CommandManager";

export class EventCore {
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
    public constructor() {
        this.core = coreInstance;
        this.client = coreInstance.getClient();
        this.logger.debug("Event Core created.");
    }

    /**
     * Begin listening for channel messages.
     */
    public listenMessages(): void {
        this.client.on("message", (message: Discord.Message) => {
            if (!message.author.bot && message.content.length !== 0) {
                this.core.getManager(CommandManager).parseLine(message.content,
                    message.author.id, new OnMessageState(this.core, message));
            }
        });
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
