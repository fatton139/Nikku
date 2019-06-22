export namespace GuildConfig {
    export namespace BooleanConfig {
        export enum Options {
            RESPONSE_TTS_ENABLED,
            DEV_MODE_ENABLED,
        }
        export const keys: string[] = Object.keys(GuildConfig.BooleanConfig.Options).filter((key) => isNaN(Number(key)));
    }
}
