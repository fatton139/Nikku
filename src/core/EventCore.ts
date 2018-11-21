import * as Discord from "discord.js";
import { CommandManager } from "../command/CommandManager";
import CoreState from "state/CoreState";
import NikkuCore from "core/NikkuCore";
import OnMessageState from "state/OnMessageState";
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
     * @classdesc Class for handling events.
     * @param core - The main bot core.
     */
    public constructor(client: Discord.Client) {
        this.client = client;
        // this.commandManager.addBulkCommand(defaultCommands);
        // this.commandManager.addBulkCommand(userCommands);
        // this.commandManager.addBulkCommand(shopCommands);
    }

    /**
     * Begin listening for channel messages.
     */
    public listenMessages(core: NikkuCore): void {
        this.client.on("message", (message: Discord.Message) => {
            if (!message.author.bot) {
                core.setCoreState(new OnMessageState(core, message));
                core.getCommandManager().parseLine(message.content,
                    message.author.id);
            }
        });
    }
}
