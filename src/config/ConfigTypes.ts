/**
 * Type declaration for bot configuration options/fields.
 */
export interface BotConfigOptions {
    BOT_RESPONSE_TRIGGER?: string;
    MODULE_PATHS?: string[];
    COMMAND_PREFIXES?: string[];
    REQUIRE_SPACE_AFTER_PREFIX?: boolean;
}

/**
 * Type declaration for package.json data.
 */
export interface PackagejsonData {
    REPOSITORY?: string;
    AUTHOR?: string;
    VERSION?: string;
}
