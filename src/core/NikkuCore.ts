import * as Discord from "discord.js";
import * as winston from "winston";
import { ConfigParser, PackagejsonData } from "../config";
import { Logger, ChannelTransport } from "../log";
import { CommandManager, AbstractManager } from "../managers";
import { EventType } from "../event";
import { NikkuException, ExceptionHandler } from "../exception";

import { EventCore } from "./EventCore";
import { DatabaseCore } from "./DatabaseCore";
import { CoreInitializer } from "./CoreInitializer";

/**
 * The main class of the bot, initializes most of the main processes.
 */
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
     * Main database events/handlers for the bot.
     */
    private databaseCore: DatabaseCore;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    private managers: Map<string, AbstractManager>;

    private config: ConfigParser;

    private exceptionHandler: ExceptionHandler;

    private static instance: NikkuCore;

    /**
     * @param config Initial configurations for the bot.
     * @param initializeImmediately Start main processes immediately.
     */
    public constructor(coreInitializer: CoreInitializer) {
        this.logger.debug("Nikku Core initialized.");
        this.config = new ConfigParser(coreInitializer.configurationPath, coreInitializer.dotenvPath);
        this.exceptionHandler = new ExceptionHandler(true);
        this.client = new Discord.Client();
        this.setupNikkuParameters();
        this.managers = new Map<string, AbstractManager>();
        this.eventCore = new EventCore(this);
        this.databaseCore = new DatabaseCore(this);
        NikkuCore.instance = this;
        if (coreInitializer.initializeImmediately) {
            this.startMainProcesses();
        }
    }

    private retrieveInitializationConfiguration(): void {
        try {
            this.config.parseEnvConfig().parseConfig().parsePackageJSON();
            this.config.validateEnvironmentalVariables();
        }  catch (e) {
            this.logger.error("Error while parsing configurations.");
        }
    }

    private setupNikkuParameters(): void {
        try {
            this.retrieveInitializationConfiguration();
            this.client.login(this.config.getEnvironmentVariables().discordOptions.DISCORD_BOT_TOKEN);
        } catch (e) {
            this.exceptionHandler.handleTopLevel(e, this.logger);
            process.exit();
        }
    }

    /**
     * Start the main processes of the bot.
     */
    public startMainProcesses(): void {
        try {
            this.client.on(EventType.READY, async () => {
                try {
                    this.setDebugLogChannels();
                    await this.loadModules();
                    if (await this.startDbProcesses()) {
                        this.eventCore.handleMessageEvent();
                    }
                } catch (e) {
                    this.exceptionHandler.handleTopLevel(e, this.logger);
                }
            });
        } catch (e) {
            this.exceptionHandler.handleTopLevel(e, this.logger);
        }
    }

    /**
     * Starts database related processes.
     */
    public async startDbProcesses(): Promise<boolean> {
        const pjsonData: PackagejsonData = this.config.getPackageJSONData();
        const version: string = pjsonData && pjsonData.VERSION ? pjsonData.VERSION : "0.0.0";
        try {
            await this.databaseCore.connectDb();
            this.logger.info(`Nikku v${version} started.`);
            return true;
        } catch (err) {
            // no db mode.
            this.logger.warn(`Nikku v${version} started without an database.`);
            this.logger.error(err.message);
            return false;
        }
    }

    /**
     * Loads primary bot modules.
     */
    public async loadModules(): Promise<void> {
        try {
            Promise.all([
                this.getManager(CommandManager).loadCommands(),
            ]);
        } catch (err) {
            this.logger.error(err.message);
        }
    }

    /**
     * Set Discord channels for debug/logging outputs. Configure it from a botconfig.json file.
     */
    public setDebugLogChannels(): void {
        const debugChannels = this.config.getEnvironmentVariables().discordOptions.DEBUG_OUTPUT_CHANNELS;
        if (debugChannels && debugChannels.length !== 0) {
            for (const id of debugChannels) {
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
     * @returns The database core of the bot.
     */
    public getDbCore(): DatabaseCore {
        return this.databaseCore;
    }

    /**
     * @returns The discord client instance.
     */
    public getClient(): Discord.Client {
        return this.client;
    }

    /**
     * Sets the activity of the bot.
     * @param str The activity of the bot.
     */
    public setActivity(str: string): void {
        this.client.user.setActivity(str);
    }

    public getConfig(): ConfigParser {
        return this.config;
    }

    /* tslint:disable */
    /**
     * Gets a instance of a manager.
     * @param Cls Class Type of the manager to retrieve.
     */
    public getManager<T extends AbstractManager>(Cls: (new () => T)): T {
        /* tslint:enable */
        if (!this.managers.has(Cls.name)) {
            this.managers.set(Cls.name, new Cls());
        }
        return this.managers.get(Cls.name) as T;
    }

    public static getCoreInstance(): NikkuCore {
        if (!NikkuCore.instance) {
            throw new NikkuException("Nikku core should be initialized via the constructor first.");
        } else {
            return this.instance;
        }
    }
}
