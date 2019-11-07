import * as fs from "fs";
import * as winston from "winston";
import { config as dotenvConfig, DotenvConfigOutput } from "dotenv";

import { Logger } from "../log";
import { NikkuException } from "../exception";
import { BotConfigOptions, PackagejsonData } from "../config";
import { DiscordOptions, EnvironmentalVariables, DatabaseOptions, ServiceConfig } from "./ConfigTypes";

/**
 * Configuration parser for Nikku settings.
 */
export class ConfigParser {
    public readonly logger: winston.Logger = Logger.getLogger(ConfigParser);

    private configPath: string;
    private dotenvPath?: string;
    private environmentalVariables!: EnvironmentalVariables;
    private botConfig: Partial<BotConfigOptions>;
    private packagejsonData!: PackagejsonData;

    public constructor(configPath: string = "botconfig.json", dotenvPath?: string) {
        this.configPath = configPath;
        this.dotenvPath = dotenvPath;
        this.botConfig = {};
    }

    /**
     * Parses bot configuration/settings.
     * @param configPath Path to the configuration JSON file.
     */
    public parseConfig(): this {
        let parsedConfig: BotConfigOptions;
        try {
            parsedConfig = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
        } catch (e) {
            this.logger.error(`${e.message} while parsing '${this.configPath}'.`);
            throw new NikkuException(e.message, e.stack);
        }
        const partialConfigMap: BotConfigOptions = new BotConfigOptions();
        for (const key of Object.keys(partialConfigMap)) {
            if (parsedConfig.hasOwnProperty(key)) {
                this.botConfig[key] = parsedConfig[key];
                this.logger.info(`${key} set to ${this.botConfig[key]}.`);
            } else {
                this.logger.warn(`Missing config '${key}', defaulting to ${partialConfigMap[key]}.`);
            }
        }

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
        return this.botConfig as BotConfigOptions;
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
