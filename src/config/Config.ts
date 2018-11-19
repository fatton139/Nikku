import { config as dotenvConfig } from "dotenv";
import * as fs from "fs";

export namespace Config {
    dotenvConfig();
    const pjson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    export class Discord {
        public static readonly TOKEN: string = process.env.DISCORD_TOKEN;
    }
    export class Database {
        public static readonly URL: string = process.env.DATABASE_URL;
    }
    export class Command {
        public static readonly PREFIX: string[];
    }
    export class Service {
        public static readonly CHATBOT_USER_ID: string = process.env.CHATBOT_USER_ID;
        public static readonly CHATBOT_API_KEY: string = process.env.CHATBOT_API_KEY;
    }
    export class Info {
        public static readonly GITHUB = pjson.repository;
        public static readonly AUTHOR = pjson.author;
        public static readonly VERSION = pjson.version;
    }
}
