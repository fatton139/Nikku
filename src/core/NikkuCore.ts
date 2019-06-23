import * as Discord from "discord.js";
import * as winston from "winston";
import { EventCore, DatabaseCore } from "core";
import { NikkuConfig } from "config";
import { Logger, ChannelTransport } from "log";
import CommandManager from "managers/CommandManager";
import AbstractManager from "managers/AbstractManager";
import { EventType } from "event"

export class NikkuCore {
    /**
     * Discord.js API
     */
    private client: Discord.Client;

    /**
     * Main event handlers for the bot.
     */
    private eventCore: EventCore;

    /**
     * Main database methods for the bot.
     */
    private databaseCore: DatabaseCore;

    private config: typeof NikkuConfig;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    private managers: Map<string, AbstractManager>;
    /**
     * @classdesc The main class of the bot. Initializes most of the main methods.
     */
    public constructor(config: typeof NikkuConfig) {
        this.logger.debug("Core initialized");
        this.config = config;
        this.client = new Discord.Client();
        this.managers = new Map<string, AbstractManager>();
        this.eventCore = new EventCore(this);
        this.databaseCore = new DatabaseCore(this);
    }

    /**
     * Start the main processes of the bot.
     */
    public start(): void {
        this.client.login(this.config.EnvironmentVars.DiscordOptions.TOKEN);
        this.client.on(EventType.READY, async () => {
            if (this.config.EnvironmentVars.DiscordOptions.DEBUG_CHANNELS) {
                this.setDebugLogChannels();
            }
            try {
                await this.loadModules();
                await this.databaseCore.connectDb();
                this.logger.info(`Nikku v${this.config.pjsonData.VERSION} started.`);
            } catch (err) {
                this.logger.warn(`Nikku v${this.config.pjsonData.VERSION} started without an database.`);
                this.logger.error(err.message);
                // no db mode.
            }
            this.eventCore.listenMessages();
        });
    }

    public async loadModules(): Promise<void> {
        try {
            Promise.all([
                this.getManager(CommandManager).loadCommands(),
                // this.getManager(ObjectManager).loadItems(),
            ]);
        } catch (err) {
            this.logger.error(err.message);
        }
    }

    public setDebugLogChannels(): void {
        if (this.config.EnvironmentVars.DiscordOptions.DEBUG_CHANNELS) {
            for (const id of this.config.EnvironmentVars.DiscordOptions.DEBUG_CHANNELS) {
                const channel: Discord.TextChannel = this.client.channels.get(id) as Discord.TextChannel;
                if (channel) {
                    ChannelTransport.addChannel(channel);
                }
            }
        }
    }
    /**
     * @returns The event core of the bot.
     */
    public getEventCore(): EventCore {
        return this.eventCore;
    }

    /**
     * @returns The db core of the bot.
     */
    public getDbCore(): DatabaseCore {
        return this.databaseCore;
    }

    public getClient(): Discord.Client {
        return this.client;
    }

    public getConfig(): typeof NikkuConfig {
        return this.config;
    }

    public setActivity(str: string): void {
        this.client.user.setActivity(str);
    }

    public getManager<T extends AbstractManager>(Cls: (new () => T)): T {
        if (!this.managers.has(Cls.name)) {
            this.managers.set(Cls.name, new Cls());
        }
        return this.managers.get(Cls.name) as T;
    }
}

/* Core Singleton */
export const core: NikkuCore = new NikkuCore(NikkuConfig);
