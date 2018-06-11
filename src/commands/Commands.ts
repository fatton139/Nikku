export interface IFortnightBotCommand {
    command: string;
    action: () => boolean;
}
