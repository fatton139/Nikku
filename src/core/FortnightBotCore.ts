import * as Discord from "discord.js";

import * as commandConfig from "../config/FortnightBotCommandConfig";
import * as config from "../config/FortnightBotInitConfig";

export class FortnightBotCore {
    private initConfig: config.FortnightBotInitConfig;
    private prefix: commandConfig.FortnightBotCommandConfig;
    private bot: Discord.Client;
    public constructor(initConfig: config.FortnightBotInitConfig) {
        this.initConfig = initConfig;
        this.prefix = new commandConfig.FortnightBotCommandConfig(
            [
                "!f",
                "!fortnight"
            ]
        );
        this.bot = new Discord.Client();
    }
    public start(): void {
        this.bot.login(this.initConfig.botToken);
    }
}
