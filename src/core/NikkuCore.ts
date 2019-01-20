import * as Discord from "discord.js";
import * as winston from "winston";
import NikkuException from "exception/NikkuException";
import EventCore from "core/EventCore";
import DatabaseCore from "core/DatabaseCore";
import { Config } from "config/Config";
import CoreState from "state/CoreState";
import Logger from "log/Logger";
import ChannelTransport from "log/ChannelTransport";
import CommandManager from "command/CommandManager";
import DBBradPropertySchema from "database/schemas/DBBradPropertySchema";

export default class NikkuCore {
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

    private state: CoreState;

    private commandManager: CommandManager;

    private config: typeof Config;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    /**
     * @classdesc The main class of the bot. Initializes most of the main methods.
     */
    public constructor(config: typeof Config) {
        this.logger.debug("Core Started.");
        this.config = config;
        this.client = new Discord.Client();
        this.state = new CoreState(this);
    }

    /**
     * Start the main processes of the bot.
     */
    public async start(): Promise<void> {
        this.client.login(this.config.Discord.TOKEN);
        this.client.on("ready", async () => {
            if (this.config.Discord.DEBUG_CHANNELS) {
                this.setDebugLogChannels();
            }
            if (!this.config.Command.PREFIXES) {
                this.logger.error("No command prefixes detected.");
                process.exit(1);
            }
            this.initializeComponents();
            try {
                await this.databaseCore.connectDb();
                await this.commandManager.loadCommands(this.config.Command.COMMAND_FULL_PATH,
                    this.config.Command.COMMAND_SRC, this.config.Command.COMMAND_PATHS);
                this.logger.info(`Nikku v${this.config.Info.VERSION} started.`);
                this.eventCore.listenMessages();
            } catch (err) {
                this.logger.warn(`Nikku v${this.config.Info.VERSION} started without an database.`);
                this.logger.error(err);
                // no db mode.
            }
        });
    }

    public initializeComponents(): void {
        this.eventCore = new EventCore(this);
        this.databaseCore = new DatabaseCore(this);
        this.commandManager = new CommandManager(this);
    }

    public setDebugLogChannels(): void {
        if (this.config.Discord.DEBUG_CHANNELS) {
            for (const id of this.config.Discord.DEBUG_CHANNELS) {
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

    public setCoreState(state: CoreState): void {
        this.state = state;
    }

    public getCoreState(): CoreState {
        return this.state;
    }

    public getClient(): Discord.Client {
        return this.client;
    }

    public getCommandManager(): CommandManager {
        return this.commandManager;
    }

    public getConfig(): typeof Config {
        return this.config;
    }

    public setActivity(str: string): void {
        this.client.user.setActivity(str);
    }

}

/* Core Singleton */
export const core: NikkuCore = new NikkuCore(Config);
