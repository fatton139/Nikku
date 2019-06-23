import * as fs from "fs";
import * as winston from "winston";
import { config as dotenvConfig } from "dotenv";
import { Logger } from "log";

export class ConfigParser {
    private botConfig: BotConfigOptions;
    private pjsonData: pjsonData;
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    public constructor() {
        this.botConfig = {};
        this.pjsonData = {};
    }
    public parseConfig(configPath: string): void {
        try {
            const botConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
            this.botConfig.BOT_RESPONSE_TRIGGER = botConfig["bot_response_trigger"];
            this.botConfig.MODULE_PATHS = botConfig["module_paths"];
            this.botConfig.COMMAND_PREFIXES = botConfig["command_prefixes"];
            this.botConfig.REQUIRE_SPACE_AFTER_PREFIX = botConfig["require_space_After_prefix"];
        } catch (e) {
            this.logger.error(e)
        }
    }
    public parsePackageJSON(): void {
        try {
            const data = JSON.parse(fs.readFileSync("package.json", "utf8"));
            this.pjsonData.REPOSITORY = data["repository"];
            this.pjsonData.AUTHOR = data["author"];
            this.pjsonData.VERSION = data["version"];
        } catch (e) {
            this.logger.error(e)
        }
    }
    public parseEnvConfig(): void {
        const result = dotenvConfig();
        if (result.error) {
            this.logger.error(result.error);
        }
    }
    public getBotConfig(): BotConfigOptions {
        return this.botConfig;
    }
    public getPackageJSONData(): pjsonData {
        return this.pjsonData;
    }
}