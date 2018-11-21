import * as Discord from "discord.js";
import * as winston from "winston";
import { FortniteBotException } from "exceptions/FortniteBotException";
import { EventCore } from "core/EventCore";
import { DatabaseCore } from "core/DatabaseCore";
import { Config } from "config/Config";
import { CoreState } from "state/CoreState";
import { Logger } from "logger/Logger";
import { ChannelTransport } from "logger/ChannelTransport";

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

    private config: typeof Config;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    /**
     * @classdesc The main class of the bot. Initializes most of the main methods.
     */
    public constructor(config: typeof Config) {
        this.config = config;
        this.client = new Discord.Client();
        this.eventCore = new EventCore(this.client);
        this.databaseCore = new DatabaseCore(this.config.Database.URL, this.config.DefaultUser.IDS);
        this.state = new CoreState(undefined);
    }

    /**
     * Start the main processes of the bot.
     */
    public start(): void {
        try {
            this.client.login(this.config.Discord.TOKEN);
            this.client.on("ready", () => {
                this.setDebugLogChannels();
                this.logger.info(`Nikku v${this.config.Info.VERSION} started.`);
                this.databaseCore.connectDb().then(() => {
                    this.logger.info("Database connected successfully.");
                    this.eventCore.listenMessages();
                    this.client.user.setActivity("Brad's Weight: NaN");
                });
            });
        } catch (error) {
            if (error instanceof FortniteBotException) {
                // console.log(error);
            }
        }
    }

    public setDebugLogChannels(): void {
        for (const id of this.config.Discord.DEBUG_CHANNELS) {
            const channel: Discord.TextChannel = this.client.channels.get(id) as Discord.TextChannel;
            if (channel) {
                ChannelTransport.addChannel(channel);
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
}

/* Core Singleton */
export const core: NikkuCore = new NikkuCore(Config);
