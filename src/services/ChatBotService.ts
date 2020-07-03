import * as ChatBot from "cleverbot.io";
import * as Discord from "discord.js";
import * as winston from "winston";
import { Config } from "config/Config";
import Logger from "log/Logger";
import OnMessageState from "state/OnMessageState";
import StringFunc from "utils/StringFunc";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";
import { GuildConfig } from "config/GuildBooleanConfig";

const cleverbot = require("cleverbot-free");

const responseWrapper = (ask: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        cleverbot(ask).then((response: string) => {
            return resolve(response);
        })
    })
}

export default class ChatBotService {

    private bot: ChatBot;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    public constructor(config: typeof Config) {

    }

    public async sendMessage(state: OnMessageState): Promise<boolean> {
        const m: Discord.Message = state.getHandle();
        const str = StringFunc.removeStrBothEndsNoSpace(m.content, "mrfortnite");
        if (str.length === 0) {
            return false;
        }
        try {
            const guild = await DBGuildPropertySchema.getGuildById(state.getHandle().guild.id);
            const ttsEnabled = await guild.getBooleanConfig(GuildConfig.BooleanConfig.Options.RESPONSE_TTS_ENABLED);
            await m.channel.send(await responseWrapper(str));
            return true;
        } catch (err) {
            throw err;
        }
    }
}
