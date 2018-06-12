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
    private eventManager: FortniteBotEventCore;
    public constructor(initConfig: FortniteBotInitConfig) {
        this.initConfig = initConfig;
        this.bot = new Discord.Client();
        this.commandManager = new CommandManager(defaultCommands);
        this.eventManager = new FortniteBotEventCore(this.bot);
    }
    public start(): FortniteBotCore {
        this.bot.login(this.initConfig.botToken);
        return this;
    }
    public clearState(): void {
        this.botState = null;
    }
}
