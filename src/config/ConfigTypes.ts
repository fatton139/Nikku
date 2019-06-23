declare type BotConfigOptions = {
    BOT_RESPONSE_TRIGGER?: string;
    MODULE_PATHS?: string[];
    COMMAND_PREFIXES?: string[];
    REQUIRE_SPACE_AFTER_PREFIX?: boolean;
}

declare type pjsonData = {
    REPOSITORY?: string;
    AUTHOR?: string;
    VERSION?: string;
}
