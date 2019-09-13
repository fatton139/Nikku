import * as Discord from "discord.js";
import * as winston from "winston";

import { Logger } from "../log";
import { OnMessageState } from "../state";
import { EventType } from "../event";
import { CommandManager } from "../managers";

import { NikkuCore } from "./NikkuCore";

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
    public constructor(core: NikkuCore) {
        this.core = core;
        this.client = core.getClient();
        this.logger.debug("Event Core created.");
    }

    /**
     * Begin listening for channel messages.
     */
    public handleMessageEvent(): void {
        this.client.on(EventType.MESSAGE, (message: Discord.Message) => {
            if (!message.author.bot && message.content.length !== 0) {
                this.core.getManager(CommandManager).parseLine(message.content,
                    message.author.id, new OnMessageState(message));
            }
        });
    }

    public handleGuildRegistration(): void {
        this.client.on("guildCreate", (guild) => {
            this.logger.debug(`Joined new server "${guild.name}".`);
        });

        this.client.on("guildDelete", (guild) => {
            this.logger.debug(`Left server "${guild.name}".`);
        });
    }
}
