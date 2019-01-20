import { config as dotenvConfig } from "dotenv";
import * as fs from "fs";
import * as path from "path";

export namespace Config {
    dotenvConfig();
    const pjson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    export class Discord {
        public static readonly TOKEN: string = process.env.DISCORD_TOKEN;
        public static readonly DEBUG_CHANNELS: string[] = process.env.DEBUG_CHANNELS ?
            process.env.DEBUG_CHANNELS.replace(/\s/g, "").split(",") : undefined;
    }
    export class Database {
        public static readonly URL: string = process.env.DATABASE_URL;
    }
    export class Command {
        public static readonly BOT_RESPONSE_TRIGGER = "Mr Fortnite";
        public static readonly PREFIXES: string[] = process.env.PREFIXES ?
            process.env.PREFIXES.replace(/\s/g, "").split(",") : ["!f"];
        public static readonly COMMAND_SRC: string = "command/modules";
        public static readonly COMMAND_FULL_PATH: string =
            `${path.dirname(require.main.filename)}/src/${Command.COMMAND_SRC}`;
        public static readonly COMMAND_PATHS: string[] =
        [
            "mrfortnite",
            "util",
            "user",
            "brad",
            "interactions",
        ];
    }
    export class Service {
        public static readonly CHATBOT_USER_ID: string = process.env.CHATBOT_USER_ID;
        public static readonly CHATBOT_API_KEY: string = process.env.CHATBOT_API_KEY;
        public static readonly CHATBOT_SESSION: string = process.env.CHATBOT_SESSION;
    }
    export class Info {
        public static readonly GITHUB = pjson.repository;
        public static readonly AUTHOR = pjson.author;
        public static readonly VERSION = pjson.version;
    }
    export class DefaultUser {
        public static readonly IDS: string[] = process.env.DEV_IDS ?
            process.env.DEV_IDS.replace(/\s/g, "").split(",") : undefined;
    }
    export class Brad {
        public static readonly DEFAULT_WEIGHT: number = 200;
    }
}
