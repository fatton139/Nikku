/**
 * Type declaration for bot configuration options/fields.
 */
export class BotConfigOptions {
    [index: string]: any | undefined;
    public readonly BOT_RESPONSE_TRIGGER: string | undefined = void 0;
    public readonly MODULE_PATHS: string[] = [];
    public readonly COMMAND_PREFIXES: string[] = [];
    public readonly REQUIRE_SPACE_AFTER_PREFIX: boolean | undefined = false;
}

/**
 * Type declaration for package.json data.
 */
export interface PackagejsonData {
    readonly REPOSITORY: string | undefined;
    readonly AUTHOR: string | undefined;
    readonly VERSION: string | undefined;
}

export interface DiscordOptions {
    readonly DISCORD_BOT_TOKEN: string | undefined;
    readonly DEBUG_OUTPUT_CHANNELS: string[] | undefined;
    readonly DEVELOPER_IDS: string[] | undefined;
}

export interface DatabaseOptions {
    readonly URI: string | undefined;
}

export interface ServiceConfig {
    readonly CHATBOT_USER_ID: string | undefined;
    readonly CHATBOT_API_KEY: string | undefined;
    readonly CHATBOT_SESSION: string | undefined;
}

export interface EnvironmentalVariables {
    readonly discordOptions: DiscordOptions;
    readonly databaseOptions: DatabaseOptions;
    readonly serviceConfig: ServiceConfig;
}
