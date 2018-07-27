import * as Discord from "discord.js";
import { FortniteBotCore } from "./FortniteBotCore";
import { FortniteBotState } from "../state/FortniteBotState";
import { CommandManager } from "../command/CommandManager";
import { defaultCommands } from "../command/DefaultCommands";
import { userCommands } from "../command/UserCommands";
import { User } from "../user/User";
import { shopCommands } from "../command/ShopCommand";

export class FortniteBotEventCore {
    /**
     * Main core of the bot.
     */
    private core: FortniteBotCore;

    /**
     * Main interface with Discord.js
     */
    private client: Discord.Client;

    /**
     * Current state handler for events.
     */
    private currentHandles: any;

    /**
     * The command manager to handle commands execution.
     */
    private commandManager: CommandManager;

    /**
     * @classdesc Class for handling events.
     * @param core - The main bot core.
     */
    public constructor(core: FortniteBotCore) {
        this.core = core;
        this.client = core.bot;
        this.commandManager = new CommandManager(defaultCommands);
        this.commandManager.addBulkCommand(userCommands);
        this.commandManager.addBulkCommand(shopCommands);
        this.currentHandles = {};
    }

    /**
     * Begin listening for channel messages.
     */
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

    /**
     * Gets the current event handles.
     * @returns The current event handles.
     */
    public getHandles(): any {
        return this.currentHandles;
    }

    /**
     * Clears the discordAPI.
     */
    public clearClient(): void {
        this.client = null;
    }
}
