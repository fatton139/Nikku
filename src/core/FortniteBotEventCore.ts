import * as Discord from "discord.js";
import { FortniteBotCore } from "./FortniteBotCore";
import { FortniteBotState } from "../state/FortniteBotState";
import { CommandManager } from "../command/CommandManager";
import { defaultCommands } from "../command/DefaultCommands";
import { userCommands } from "../command/UserCommands";
import { User } from "../user/User";
import { shopCommands } from "../command/ShopCommand";

export class FortniteBotEventCore {
    private core: FortniteBotCore;
    private client: Discord.Client;
    private currentHandles: any;
    private commandManager: CommandManager;
    public constructor(core: FortniteBotCore) {
        this.core = core;
        this.client = core.bot;
        this.commandManager = new CommandManager(defaultCommands);
        this.commandManager.addBulkCommand(userCommands);
        this.commandManager.addBulkCommand(shopCommands);
        this.currentHandles = {};
    }
    public listenMessages(): void {
        this.client.on("message", (message) => {
            this.currentHandles.message = message;
            this.core.setCoreState(new FortniteBotState(message));
            if (!message.author.bot) {
                this.commandManager.attemptExecution(message.content,
                message.author.id);
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
