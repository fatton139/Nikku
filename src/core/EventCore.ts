import * as Discord from "discord.js";
import { CommandManager } from "../command/CommandManager";
import { CoreState } from "state/CoreState";
import { core } from "core/NikkuCore";
// import { defaultCommands } from "../command/DefaultCommands";
// import { userCommands } from "../command/UserCommands";
// import { User } from "../user/User";
// import { shopCommands } from "../command/ShopCommand";

export class EventCore {

    /**
     * Main interface with Discord.js
     */
    private client: Discord.Client;

    /**
     * The command manager to handle commands execution.
     */
    private commandManager: CommandManager;

    /**
     * @classdesc Class for handling events.
     * @param core - The main bot core.
     */
    public constructor(client: Discord.Client) {
        this.commandManager = new CommandManager();
        this.client = client;
        // this.commandManager.addBulkCommand(defaultCommands);
        // this.commandManager.addBulkCommand(userCommands);
        // this.commandManager.addBulkCommand(shopCommands);
    }

    /**
     * Begin listening for channel messages.
     */
    public listenMessages(): void {
        this.client.on("message", (message) => {
            core.setCoreState(new CoreState(message));
            if (!message.author.bot) {
                this.commandManager.attemptExecution(message.content,
                message.author.id);
            }
        });
    }

    /**
     * Gets the current CommandManager Object.
     * @returns The current CommandManager Object.
     */
    public getCommandManager(): CommandManager {
        return this.commandManager;
    }
}
