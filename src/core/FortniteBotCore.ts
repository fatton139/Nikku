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
    private coreState: FortniteBotState;
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
                this.coreState = new FortniteBotState(message);
                if (!message.author.bot) { // will be part of user soon
                    this.commandManager.attemptExecution(message.content,
                        new User("123", 3 , "test"));
                }
            });
        });
        return this;
    }
    public changeCoreState(coreState: FortniteBotState): void {
        const newState = coreState;
        newState.setHandle(this.getCoreState().getHandle());
        this.setCoreState(newState);
    }
    public setCoreState(coreState: FortniteBotState): void {
        this.coreState = coreState;
    }
    public getCoreState(): FortniteBotState {
        return this.coreState;
    }
    public clearState(): void {
        this.coreState = null;
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
    public coreToString(): string {
        const x = JSON.stringify(this);
        return x;
    }
}
