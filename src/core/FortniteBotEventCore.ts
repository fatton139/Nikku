import * as Discord from "discord.js";
import { FortniteBotCore } from "./FortniteBotCore";
import { FortniteBotState } from "../state/FortniteBotState";
import { CommandManager } from "../command/CommandManager";
import { defaultCommands } from "../command/DefaultCommands";
import { User } from "../user/User";

export class FortniteBotEventCore {
    private core: FortniteBotCore;
    private client: Discord.Client;
    private currentHandles: any;
    private commandManager: CommandManager;
    public constructor(core: FortniteBotCore) {
        this.core = core;
        this.client = core.bot;
        this.commandManager = new CommandManager(defaultCommands);
        this.currentHandles = {};
    }
    public listenMessages(): void {
        this.client.on("message", (message) => {
            this.currentHandles.message = message;
            this.core.setCoreState(new FortniteBotState(message));
            if (!message.author.bot) {
                this.commandManager.attemptExecution(message.content,
                    new User("123", 3 , "test"));
            }
        });
    }
    public getHandles(): any {
        return this.currentHandles;
    }
    public clearClient(): void {
        this.client = null;
    }
}
