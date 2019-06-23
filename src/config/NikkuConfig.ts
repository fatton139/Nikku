import { ConfigParser } from "config";

/**
 * Namespace to for all bot configurations.
 */
export namespace NikkuConfig {
    const configParser = new ConfigParser();
    export const botConfigOptions = configParser.getBotConfig();
    export const pjsonData = configParser.getPackageJSONData();
    export namespace EnvironmentVars {
        export namespace DiscordOptions {
            export const TOKEN: string | undefined = process.env.DISCORD_TOKEN;
            export const DEBUG_CHANNELS: string[] | undefined = process.env.DEBUG_CHANNELS ?
                process.env.DEBUG_CHANNELS.replace(/\s/g, "").split(",") : undefined;
        }
        export namespace DatabaseOptions {
            export const URI: string | undefined = process.env.DATABASE_URI;
        }
        export namespace ServiceOptions {
            export const CHATBOT_USER_ID: string | undefined = process.env.CHATBOT_USER_ID;
            export const CHATBOT_API_KEY: string | undefined = process.env.CHATBOT_API_KEY;
            export const CHATBOT_SESSION: string | undefined = process.env.CHATBOT_SESSION;
        }
        export namespace DevUsers {
            export const IDS: string[] | undefined = process.env.DEV_IDS ?
                process.env.DEV_IDS.replace(/\s/g, "").split(",") : undefined;
        }
    }
}
