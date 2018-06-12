import * as Discord from "discord.js";

import { FortniteBotInitConfig } from "../config/FortniteBotInitConfig";
import { FortniteBotException } from "../exceptions/FortniteBotException";
import { FortniteBotEventCore } from "../core/FortniteBotEventCore";
import { FortniteBotState } from "../state/FortniteBotState";
import { CommandExecutionState } from "../state/CommandExecutionState";
import { CommandManager } from "../command/CommandManager";
import { User } from "../user/User";

import { defaultCommands } from "../command/DefaultCommands";

export class FortniteBotCore {
    public botState: FortniteBotState;
    private initConfig: FortniteBotInitConfig;
    private bot: Discord.Client;
    private commandManager: CommandManager;
    private eventCore: FortniteBotEventCore;
    public constructor(initConfig: FortniteBotInitConfig) {
        this.initConfig = initConfig;
        this.bot = new Discord.Client();
        this.commandManager = new CommandManager(defaultCommands);
        this.eventCore = new FortniteBotEventCore(this.bot);
    }
    public start(): FortniteBotCore {
        this.bot.login(this.initConfig.botToken);
        this.bot.on("ready", () => {
            this.bot.on("message", (message) => {
                this.commandManager.attemptExecution(message.content,
                    new User("123", 3 , "test"));
                const x = message.channel;
                this.botState = new CommandExecutionState(message);
            });
        });
        return this;
    }
    public clearState(): void {
        this.botState = null;
    }
    public clearInitConfig(): void {
        this.initConfig = null;
    }
    public clearDiscordAPI(): void {
        this.bot = null;
        if (this.eventCore) {
            this.eventCore.clearClient();
        }
    }
}
