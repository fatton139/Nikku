export class FortnightBotInitConfig {
    private readonly botToken: string;
    private readonly chatBotUserId: string;
    private readonly chatBotAPIKey: string;
    public constructor(botToken: string, charBotUserId: string,
                       chatBotAPIKey: string) {
        this.botToken = botToken;
        this.chatBotUserId = charBotUserId;
        this.chatBotAPIKey = chatBotAPIKey;
    }
}
