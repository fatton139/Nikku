export class FortniteBotInitConfig {
    /**
     * Discord Token for the bot user.
     */
    public readonly botToken: string;

    /**
     * Chatbot user ID.
     */
    public readonly chatBotUserId: string;

    /**
     * Chatbot API key.
     */
    public readonly chatBotAPIKey: string;

    /**
     * Initial configurations for the bot.
     * @param botToken - Discord Token for the bot user.
     * @param charBotUserId - Chatbot user ID.
     * @param chatBotAPIKey - Chatbot API key.
     */
    public constructor(botToken: string, charBotUserId: string,
                       chatBotAPIKey: string) {
        this.botToken = botToken;
        this.chatBotUserId = charBotUserId;
        this.chatBotAPIKey = chatBotAPIKey;
    }
}
