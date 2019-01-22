import { config as dotenvConfig } from "dotenv";
import * as fs from "fs";
import * as path from "path";

export namespace Config {
    dotenvConfig();
    const pjson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    export namespace Discord {
        export const TOKEN: string = process.env.DISCORD_TOKEN;
        export const DEBUG_CHANNELS: string[] = process.env.DEBUG_CHANNELS ?
            process.env.DEBUG_CHANNELS.replace(/\s/g, "").split(",") : undefined;
    }
    export namespace Database {
        export const URL: string = process.env.DATABASE_URL;
    }
    export namespace Command {
        export const BOT_RESPONSE_TRIGGER = "Mr Fortnite";
        export const PREFIXES: string[] = process.env.PREFIXES ?
            process.env.PREFIXES.replace(/\s/g, "").split(",") : ["!f"];
        export const COMMAND_SRC = "command/modules";
        export const COMMAND_FULL_PATH = `${path.dirname(require.main.filename)}/src/${Command.COMMAND_SRC}`;
        export const COMMAND_PATHS: string[] =
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
    export namespace Service {
        export const CHATBOT_USER_ID: string = process.env.CHATBOT_USER_ID;
        export const CHATBOT_API_KEY: string = process.env.CHATBOT_API_KEY;
        export const CHATBOT_SESSION: string = process.env.CHATBOT_SESSION;
    }
    export namespace Info {
        export const GITHUB = pjson.repository;
        export const AUTHOR = pjson.author;
        export const VERSION = pjson.version;
    }
    export namespace DefaultUser {
        export const IDS: string[] = process.env.DEV_IDS ?
            process.env.DEV_IDS.replace(/\s/g, "").split(",") : undefined;
    }
    export namespace Brad {
        export const DEFAULT_WEIGHT = 200;
    }
}
