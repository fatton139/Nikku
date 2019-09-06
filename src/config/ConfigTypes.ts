/**
 * Type declaration for bot configuration options/fields.
 */
declare interface BotConfigOptions {
    BOT_RESPONSE_TRIGGER?: string;
    MODULE_PATHS?: string[];
    COMMAND_PREFIXES?: string[];
    REQUIRE_SPACE_AFTER_PREFIX?: boolean;
}

/**
 * Type declaration for package.json data.
 */
declare interface PackagejsonData {
    REPOSITORY?: string;
    AUTHOR?: string;
    VERSION?: string;
}
