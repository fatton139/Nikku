import * as Discord from "discord.js";

import { FortnightBotCommandConfig } from "../config/FortnightBotCommandConfig";
import { FortnightBotInitConfig } from "../config/FortnightBotInitConfig";
import { CommandManager } from "../command/CommandManager";

import { defaultCommands } from "../command/DefaultCommands";

export class FortnightBotCore {
    private initConfig: FortnightBotInitConfig;
    private prefix: FortnightBotCommandConfig;
    private bot: Discord.Client;
    private commandManager: CommandManager;
    public constructor(initConfig: FortnightBotInitConfig) {
        this.initConfig = initConfig;
        this.prefix = new FortnightBotCommandConfig(
            [
                "!f",
                "!fortnight"
            ]
        );
        this.bot = new Discord.Client();
        this.commandManager = new CommandManager(defaultCommands);
    }
    public start(): void {
        this.bot.login(this.initConfig.botToken);
        this.bot.on("message", (message) => {
            this.commandManager.triggerAction();
        });
    }
}
