import * as Discord from "discord.js";
import { FortniteBotException } from "exceptions/FortniteBotException";
import { EventCore } from "core/EventCore";
import { DatabaseCore } from "core/DatabaseCore";
import { Config } from "config/Config";
import { CoreState } from "state/CoreState";

export default class NikkuCore {
    /**
     * Discord.js API
     */
    public client: Discord.Client;

    /**
     * Main event handlers for the bot.
     */
    private eventCore: EventCore;

    /**
     * Main database methods for the bot.
     */
    private databaseCore: DatabaseCore;

    private state: CoreState;

    /**
     * @classdesc The main class of the bot. Initializes most of the main methods.
     */
    public constructor() {
        this.client = new Discord.Client();
        this.eventCore = new EventCore();
        this.databaseCore = new DatabaseCore(Config.Database.URL);
        this.state = new CoreState(undefined);
    }

    /**
     * Start the main processes of the bot.
     */
    public start(): void {
        try {
            this.databaseCore.connectDb().then(() => {
                this.client.login(Config.Discord.TOKEN);
                this.client.on("ready", () => {
                    this.eventCore.listenMessages();
                    this.client.user.setActivity("Brad's Weight: 214.23kg");
                });
                const db = this.databaseCore.getDb();
            });
        } catch (error) {
            if (error instanceof FortniteBotException) {
                // console.log(error);
            }
        }
    }

    /**
     * @returns The event core of the bot.
     */
    public getEventCore(): EventCore {
        return this.eventCore;
    }

    /**
     * @returns The db core of the bot.
     */
    public getDbCore(): DatabaseCore {
        return this.databaseCore;
    }

    public setCoreState(state: CoreState): void {
        this.state = state;
    }

    public getCoreState(): CoreState {
        return this.state;
    }
}

/* Core Singleton */
export const core: NikkuCore = new NikkuCore();
