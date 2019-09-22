// @ts-ignore
import * as ChatBot from "cleverbot.io";
import * as Discord from "discord.js";
import * as winston from "winston";

import { Logger } from "../log";
import { OnMessageState } from "../state";
import { StringHelpers } from "../utils";
import { NikkuCore } from "../core";
import { EnvironmentalVariables } from "../config";

export class ChatBotService {
    public readonly logger: winston.Logger = Logger.getLogger(ChatBotService);

    private bot: ChatBot;

    public constructor() {
        this.logger.info("Chat bot service initialized.");
        const environment: EnvironmentalVariables = NikkuCore.getCoreInstance().getConfig().getEnvironmentVariables();
        this.bot = new ChatBot(environment.serviceConfig.CHATBOT_USER_ID, environment.serviceConfig.CHATBOT_API_KEY);
        this.bot.setNick(environment.serviceConfig.CHATBOT_SESSION);
    }

    public async sendMessage(state: OnMessageState): Promise<void> {
        const m: Discord.Message = state.getHandle();
        const responseTrigger: string =
            NikkuCore.getCoreInstance().getConfig().getBotConfig().BOT_RESPONSE_TRIGGER || "";
        const str = StringHelpers.removeStrBothEndsNoSpace(m.content, responseTrigger);
        await m.channel.send(`${await this.getResponse(str)}`);
    }

    public getResponse(message: string): Promise<string> {
        return new Promise((resolve: Function, reject: Function): void => {
            this.bot.create((errA: unknown) => {
                if (errA) {
                    return reject(errA);
                }
                this.bot.ask(message, (errB: unknown, res: string) => {
                    if (errB) {
                        return reject(errB);
                    }
                    return resolve(res);
                });
            });
        });
    }
}
