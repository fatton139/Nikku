import * as fs from "fs";
import * as winston from "winston";
import { config as dotenvConfig } from "dotenv";
import { Logger } from "log";
import { isString, isBoolean } from "util";
import { NikkuException } from "exception";

/**
 * Configuration parser for Nikku settings.
 */
export class ConfigParser {
    private botConfig: BotConfigOptions;
    private packagejsonData: PackagejsonData;
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    public constructor() {
        this.botConfig = {};
        this.packagejsonData = {};
    }
    /**
     * Parses bot configuration/settings.
     * @param configPath Path to the configuration JSON file.
     */
    public parseConfig(configPath: string): this {
        try {
            const botConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
            if (botConfig.bot_response_trigger && isString(botConfig.bot_response_trigger)) {
                this.botConfig.BOT_RESPONSE_TRIGGER = botConfig.bot_response_trigger;
            } else {
                throw new NikkuException("Invalid bot response trigger word.");
            }
            this.botConfig.MODULE_PATHS = botConfig.module_paths &&
                Array.isArray(botConfig.module_paths) ? botConfig.module_paths : [];
            this.botConfig.COMMAND_PREFIXES = botConfig.command_prefixes &&
                Array.isArray(botConfig.command_prefixes) ? botConfig.command_prefixes : [];
            this.botConfig.REQUIRE_SPACE_AFTER_PREFIX = botConfig.require_space_after_prefix &&
                isBoolean(botConfig.require_space_after_prefix) ? botConfig.require_space_after_prefix : true;
        } catch (e) {
            this.logger.error(e);
            throw new NikkuException(e.message, e.stack);
        }
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
            this.logger.error(e);
        }
        return this;
    }
    /**
     * Loads environment variables with dotenv.
     */
    public parseEnvConfig(): this {
        const result = dotenvConfig();
        if (result.error) {
            this.logger.error(result.error);
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
