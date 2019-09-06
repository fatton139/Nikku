import * as Discord from "discord.js";
import * as winston from "winston";
import { Logger } from "log";
import { Nikku } from "core";
import { core as coreInstance } from "core/NikkuCore";
import OnMessageState from "state/OnMessageState";
import CommandManager from "managers/CommandManager";

export class EventCore {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    /**
     * Main interface with Discord.js
     */
    private client: Discord.Client;

    private core: Nikku.Core;

    /**
     * @classdesc Class for handling events.
     * @param core - The main bot core.
     */
    public constructor() {
        this.core = coreInstance;
        this.client = this.core.getClient();
        this.logger.debug("Event Core created.");
    }

    /**
     * Begin listening for channel messages.
     */
    public listenMessages(): void {
        this.client.on("message", (message: Discord.Message) => {
            if (!message.author.bot && message.content.length !== 0) {
                this.core.getManager(CommandManager).parseLine(message.content,
                    message.author.id, new OnMessageState(message));
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
