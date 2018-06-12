import * as Discord from "discord.js";

import { FortnightBotInitConfig } from "../config/FortnightBotInitConfig";
import { CommandManager } from "../command/CommandManager";
import { User } from "../user/User";
import { FortnightBotException } from "../exceptions/FortnightBotException";
import { FortnightBotEventCore } from "../core/FortnightBotEventCore";

import { defaultCommands } from "../command/DefaultCommands";

export class FortnightBotCore {
    private initConfig: FortnightBotInitConfig;
    private bot: Discord.Client;
    private commandManager: CommandManager;
    private eventManager: FortnightBotEventCore;
    public constructor(initConfig: FortnightBotInitConfig) {
        this.initConfig = initConfig;
        this.bot = new Discord.Client();
        this.commandManager = new CommandManager(defaultCommands);
        this.eventManager = new FortnightBotEventCore(this.bot);
    }
    public start(): FortnightBotCore {
        this.bot.on("message", (message) => {
            this.commandManager.attemptExecution(message.content,
                new User("a", 0 , "b"));
        });
        this.bot.login(this.initConfig.botToken);
        return this;
    }
}
