import * as ChatBot from "cleverbot.io";
import * as Discord from "discord.js";
import * as winston from "winston";
import Config from "config/Config";
import Logger from "log/Logger";

export default class ChatBotService {

    private bot: ChatBot;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    public constructor(config: typeof Config) {
        this.bot = new ChatBot(config.Service.CHATBOT_USER_ID, config.Service.CHATBOT_API_KEY);
        this.bot.setNick(config.Service.CHATBOT_SESSION);
    }

    public async sendMessage(message: string, channel: Discord.TextChannel): Promise<void> {
        try {
            const response = await this.getResponse(message);
            channel.send(response);
            return Promise.resolve();
        } catch (err) {
            this.logger.warn(err);
        }
        return Promise.reject();
    }

    public getResponse(message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.bot.create((errA) => {
                if (errA) {
                    return reject(errA);
                }
                this.bot.ask(message, (errB, res) => {
                    if (errB) {
                        return reject(errB);
                    }
                    return resolve(res);
                });
            });
        });
    }
}
