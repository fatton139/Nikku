import { config as dotenvConfig } from "dotenv";
import * as fs from "fs";

export namespace Config {
    dotenvConfig();
    const pjson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    export namespace Discord {
        export const TOKEN: string | undefined = process.env.DISCORD_TOKEN;
        export const DEBUG_CHANNELS: string[] | undefined = process.env.DEBUG_CHANNELS ?
            process.env.DEBUG_CHANNELS.replace(/\s/g, "").split(",") : undefined;
    }
    export namespace Database {
        export const URI: string | undefined = process.env.DATABASE_URI;
    }
    export namespace Command {
        export const BOT_RESPONSE_TRIGGER = "Mr Fortnite";
        export const PREFIXES: string[] = process.env.PREFIXES ?
            process.env.PREFIXES.replace(/\s/g, "").split(",") : ["!f"];
        export const DIR_PATH = "command/modules";
        export const MODULE_PATHS: string[] =
        [
            "mrfortnite",
            "util",
            "user",
            "brad",
            "interactions",
            "config",
            "guild",
        ];
    }
    export namespace Items {
        export const DIR_PATH = "objects";
        export const MODULE_PATHS: string[] =
        [
            "items",
        ];
    }
    export namespace Service {
        export const CHATBOT_USER_ID: string | undefined = process.env.CHATBOT_USER_ID;
        export const CHATBOT_API_KEY: string | undefined = process.env.CHATBOT_API_KEY;
        export const CHATBOT_SESSION: string | undefined = process.env.CHATBOT_SESSION;
    }
    export namespace Info {
        export const GITHUB = pjson.repository;
        export const AUTHOR = pjson.author;
        export const VERSION = pjson.version;
    }
    export namespace DefaultUser {
        export const IDS: string[] | undefined = process.env.DEV_IDS ?
            process.env.DEV_IDS.replace(/\s/g, "").split(",") : undefined;
    }
    export namespace Brad {
        export const DEFAULT_WEIGHT = 200;
    }
}
