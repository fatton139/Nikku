import * as Discord from "discord.js";
import NikkuCore from "core/NikkuCore";
import OnMessageState from "state/OnMessageState";

export default class EventCore {

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
