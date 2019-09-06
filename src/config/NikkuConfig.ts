import { ConfigParser } from "./";

/**
 * Namespace to for all bot configurations.
 */
export namespace NikkuConfig {
    export const configParser = new ConfigParser();
    configParser.parseEnvConfig();
    export const botConfigOptions = configParser.getBotConfig();
    export const pjsonData = configParser.getPackageJSONData();
    /**
     * Internal namespace for environment variables.
     */
    export namespace EnvironmentVariables {
        /**
         * Options regarding discord.js
         */
        export namespace DiscordOptions {
            export const TOKEN: string | undefined = process.env.DISCORD_TOKEN;
            export const DEBUG_CHANNELS: string[] | undefined = process.env.DEBUG_CHANNELS ?
                process.env.DEBUG_CHANNELS.replace(/\s/g, "").split(",") : undefined;
        }
        /**
         * Database settings and keys.
         */
        export namespace DatabaseOptions {
            export const URI: string | undefined = process.env.DATABASE_URI;
        }
        /**
         * Options and keys for internal services.
         */
        export namespace ServiceOptions {
            export const CHATBOT_USER_ID: string | undefined = process.env.CHATBOT_USER_ID;
            export const CHATBOT_API_KEY: string | undefined = process.env.CHATBOT_API_KEY;
            export const CHATBOT_SESSION: string | undefined = process.env.CHATBOT_SESSION;
        }
        /**
         * Developer discord user IDs.
         */
        export namespace DevUsers {
            export const IDS: string[] | undefined = process.env.DEV_IDS ?
                process.env.DEV_IDS.replace(/\s/g, "").split(",") : undefined;
        }
    }
}
