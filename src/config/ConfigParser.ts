import * as fs from "fs";
import * as winston from "winston";
import { isString, isBoolean } from "util";
import { config as dotenvConfig, DotenvConfigOutput } from "dotenv";
import { Logger } from "../log";
import { NikkuException } from "../exception";
import { BotConfigOptions, PackagejsonData } from "../config";
import { DiscordOptions, EnvironmentalVariables, DatabaseOptions, ServiceConfig } from "./ConfigTypes";

/**
 * Configuration parser for Nikku settings.
 */
export class ConfigParser {
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    private configPath: string;
    private dotenvPath?: string;
    private environmentalVariables!: EnvironmentalVariables;
    private botConfig!: BotConfigOptions;
    private packagejsonData!: PackagejsonData;

    public constructor(configPath = "botconfig.json", dotenvPath?: string) {
        this.configPath = configPath;
        this.dotenvPath = dotenvPath;
    }

    /**
     * Parses bot configuration/settings.
     * @param configPath Path to the configuration JSON file.
     */
    public parseConfig(): this {
        let botConfig: any;
        try {
            botConfig = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
        } catch (e) {
            this.logger.error(`${e.message} while parsing '${this.configPath}'.`);
            throw new NikkuException(e.message, e.stack);
        }

        let botResponseTrigger: string | undefined;
        if (botConfig.BOT_RESPONSE_TRIGGER && isString(botConfig.BOT_RESPONSE_TRIGGER)) {
            botResponseTrigger = botConfig.BOT_RESPONSE_TRIGGER;
            this.logger.info(`Response trigger word set to ${this.botConfig.BOT_RESPONSE_TRIGGER}`);
        } else {
            this.logger.warn("Invalid response trigger word. Chat services will be disabled.");
        }

        let modulePaths: string[] | undefined;
        if (botConfig.MODULE_PATHS && Array.isArray(botConfig.MODULE_PATHS)) {
            modulePaths = botConfig.MODULE_PATHS;
            for (const path of botConfig.MODULE_PATHS) {
                this.logger.info(`Using ${path} as module path.`);
            }
        } else {
            modulePaths = [];
            this.logger.verbose("No module path specified in config. Using only explicity loaded commands.");
        }

        if (botConfig.COMMAND_PREFIXES && Array.isArray(botConfig.COMMAND_PREFIXES)) {
            for (const prefix of botConfig.COMMAND_PREFIXES) {
                this.logger.info(`Using ${prefix} as command prefix.`);
            }
        } else {
            this.logger.verbose("No command prefix specified in config. Using only explicitly loaded prefixes.");
        }

        this.botConfig = {
            BOT_RESPONSE_TRIGGER: botResponseTrigger,
            MODULE_PATHS: modulePaths,
            COMMAND_PREFIXES: botConfig.COMMAND_PREFIXES,
            REQUIRE_SPACE_AFTER_PREFIX: botConfig.REQUIRE_SPACE_AFTER_PREFIX &&
                isBoolean(botConfig.REQUIRE_SPACE_AFTER_PREFIX) ? botConfig.REQUIRE_SPACE_AFTER_PREFIX : true,
        };

        return this;
    }

    /**
     * Retrieves relevant package.json data.
     */
    public parsePackageJSON(): this {
        try {
            const data = JSON.parse(fs.readFileSync("package.json", "utf8"));
            this.packagejsonData = {
                REPOSITORY: data.repository,
                AUTHOR: data.author,
                VERSION: data.version,
            };
        } catch (e) {
            this.logger.error(e.message);
            throw new NikkuException(e.message, e.stack);
        }
        return this;
    }

    private retrieveEnvironmentDiscordOptions(): DiscordOptions {
        return {
            DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
            DEBUG_OUTPUT_CHANNELS: process.env.DEBUG_CHANNELS ?
                process.env.DEBUG_CHANNELS.replace(/\s/g, "").split(",") : undefined,
            DEVELOPER_IDS: process.env.DEV_IDS ? process.env.DEV_IDS.replace(/\s/g, "").split(",") : undefined,
        };
    }

    private retrieveEnvironmentDatabaseOptions(): DatabaseOptions {
        return {
            URI: process.env.DATABASE_URI,
        };
    }

    private retrieveEnvironmentServiceConfig(): ServiceConfig {
        return {
            CHATBOT_USER_ID: process.env.CHATBOT_USER_ID,
            CHATBOT_API_KEY: process.env.CHATBOT_API_KEY,
            CHATBOT_SESSION: process.env.CHATBOT_SESSION,
        };
    }

    /**
     * Loads environment variables with dotenv.
     */
    public parseEnvConfig(): this {
        const result: DotenvConfigOutput = this.dotenvPath ? dotenvConfig({path: this.dotenvPath}) : dotenvConfig();
        if (this.dotenvPath) {
            this.logger.info(`Using ${this.dotenvPath} as environment variable file.`);
        } else {
            this.logger.info(`No environment variable file specified. Using default file '.env'.`);
        }
        if (result.error) {
            this.logger.error(result.error.message);
            throw new NikkuException(result.error.message, result.error.stack);
        }
        this.environmentalVariables = {
            discordOptions: this.retrieveEnvironmentDiscordOptions(),
            databaseOptions: this.retrieveEnvironmentDatabaseOptions(),
            serviceConfig: this.retrieveEnvironmentServiceConfig(),
        };
        return this;
    }

    public validateEnvironmentalVariables(): void {
        let exception: NikkuException | undefined;
        if (!this.environmentalVariables.discordOptions.DISCORD_BOT_TOKEN) {
            exception = new NikkuException(
                "Missing Discord bot token in environment variables. Please specify 'DISCORD_BOT_TOKEN'.",
            );
        }
        // Additional checking for other options.
        if (exception) {
            throw exception;
        }
    }

    /**
     * Gets bot configurations.
     */
    public getBotConfig(): BotConfigOptions {
        return this.botConfig;
    }
    /**
     * Gets package.json data.
     */
    public getPackageJSONData(): PackagejsonData {
        return this.packagejsonData;
    }

    public getEnvironmentVariables(): EnvironmentalVariables {
        return this.environmentalVariables;
    }
}
