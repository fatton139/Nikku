export class FortnightBotInitConfig {
    public readonly botToken: string;
    public readonly chatBotUserId: string;
    public readonly chatBotAPIKey: string;
    public constructor(botToken: string, charBotUserId: string,
                       chatBotAPIKey: string) {
        this.botToken = botToken;
        this.chatBotUserId = charBotUserId;
        this.chatBotAPIKey = chatBotAPIKey;
    }
}
