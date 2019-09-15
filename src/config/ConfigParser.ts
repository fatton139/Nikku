import * as fs from "fs";
import * as winston from "winston";
import { isString, isBoolean } from "util";
import { config as dotenvConfig, DotenvConfigOutput } from "dotenv";
import { Logger } from "../log";
import { NikkuException } from "../exception";
import { BotConfigOptions, PackagejsonData } from "../config";

/**
 * Configuration parser for Nikku settings.
 */
export class ConfigParser {
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    private botConfig: BotConfigOptions;
    private packagejsonData: PackagejsonData;
    private configPath: string;
    private dotenvPath?: string;

    public constructor(configPath = "botconfig.json", dotenvPath?: string) {
        this.botConfig = {};
        this.packagejsonData = {};
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
        if (botConfig.BOT_RESPONSE_TRIGGER && isString(botConfig.BOT_RESPONSE_TRIGGER)) {
            this.botConfig.BOT_RESPONSE_TRIGGER = botConfig.BOT_RESPONSE_TRIGGER;
            this.logger.info(`Response trigger word set to ${this.botConfig.BOT_RESPONSE_TRIGGER}`);
        } else {
            this.logger.warn("Invalid response trigger word. Chat services will be disabled.");
        }

        if (botConfig.MODULE_PATHS && Array.isArray(botConfig.MODULE_PATHS)) {
            this.botConfig.MODULE_PATHS = botConfig.MODULE_PATHS;
            for (const path of botConfig.MODULE_PATHS) {
                this.logger.info(`Using ${path} as module path.`);
            }
        } else {
            this.botConfig.MODULE_PATHS = [];
            this.logger.verbose("No module path specified in config. Using only explicity loaded commands.");
        }

        if (botConfig.COMMAND_PREFIXES && Array.isArray(botConfig.COMMAND_PREFIXES)) {
            this.botConfig.COMMAND_PREFIXES = botConfig.COMMAND_PREFIXES;
            for (const prefix of botConfig.COMMAND_PREFIXES) {
                this.logger.info(`Using ${prefix} as command prefix.`);
            }
        } else {
            this.logger.verbose("No command prefix specified in config. Using only explicitly loaded prefixes.");
        }

        this.botConfig.REQUIRE_SPACE_AFTER_PREFIX = botConfig.REQUIRE_SPACE_AFTER_PREFIX &&
            isBoolean(botConfig.REQUIRE_SPACE_AFTER_PREFIX) ? botConfig.REQUIRE_SPACE_AFTER_PREFIX : true;

        return this;
    }

    /**
     * Retrieves relevant package.json data.
     */
    public parsePackageJSON(): this {
        try {
            const data = JSON.parse(fs.readFileSync("package.json", "utf8"));
            this.packagejsonData.REPOSITORY = data.repository;
            this.packagejsonData.AUTHOR = data.author;
            this.packagejsonData.VERSION = data.version;
        } catch (e) {
            this.logger.error(e.message);
            throw new NikkuException(e.message, e.stack);
        }
        return this;
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
        return this;
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
}
