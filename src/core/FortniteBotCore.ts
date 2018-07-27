import * as Discord from "discord.js";
import { config as dotenvConfig } from "dotenv";
import { FortniteBotInitConfig } from "../config/FortniteBotInitConfig";
import { FortniteBotException } from "../exceptions/FortniteBotException";
import { FortniteBotEventCore } from "./FortniteBotEventCore";
import { FortniteBotState } from "../state/FortniteBotState";
import { FortniteBotDbCore } from "./FortniteBotDbCore";
import { FortniteBotDbConfig } from "../config/FortniteBotDbConfig";

export class FortniteBotCore {
    /**
     * Main interface with Discord.js
     */
    public bot: Discord.Client;

    /**
     * Current state of the bot.
     */
    private coreState: FortniteBotState;

    /**
     * Initial configurations loaded in to the bot.
     */
    private initConfig: FortniteBotInitConfig;

    /**
     * Main event handlers for the bot.
     */
    private eventCore: FortniteBotEventCore;

    /**
     * Main database methods for the bot.
     */
    private DbCore: FortniteBotDbCore;

    /**
     * @classdesc The main class of the bot. Initializes most of the main methods.
     * @param initConfig - Initial configurations to load in to the bot.
     */
    public constructor(initConfig: FortniteBotInitConfig) {
        dotenvConfig();
        this.initConfig = initConfig;
        this.bot = new Discord.Client();
        this.eventCore = new FortniteBotEventCore(this);
        const dbConfig = new FortniteBotDbConfig(process.env.dbIp);
        this.DbCore = new FortniteBotDbCore(dbConfig);
    }

    /**
     * Start the main processes of the bot.
     * @returns The current instance of the core.
     */
    public start(): FortniteBotCore {
        try {
            this.DbCore.connectDb(() => {
                this.bot.login(this.initConfig.botToken);
                this.bot.on("ready", () => {
                    this.eventCore.listenMessages();
                    this.bot.user.setActivity("Brad's Weight: 214.23kg");
                });
                const db = this.DbCore.getDb();
            });
        } catch (error) {
            if (error instanceof FortniteBotException) {
                // console.log(error);
            }
        }
        return this;
    }

    /**
     * @returns The event core of the bot.
     */
    public getEventCore(): FortniteBotEventCore {
        return this.eventCore;
    }

    /**
     * @returns The db core of the bot.
     */
    public getDbCore(): FortniteBotDbCore {
        return this.DbCore;
    }

    /**
     * Changes the current state the bot is in. Handle is preserved.
     * @param coreState - New state for the bot.
     */
    public changeCoreState(coreState: FortniteBotState): void {
        const newState = coreState;
        newState.setHandle(this.getCoreState().getHandle());
        this.setCoreState(newState);
    }

    /**
     * Changes the current state the bot is in.
     * @param coreState - New state for the bot.
     */
    public setCoreState(coreState: FortniteBotState): void {
        this.coreState = coreState;
    }

    /**
     * @returns The current state of the bot.
     */
    public getCoreState(): FortniteBotState {
        return this.coreState;
    }

    /**
     * Clears the state of the bot.
     */
    public clearState(): void {
        this.coreState = null;
    }

    /**
     * Clears initial configurations loaded in the bot.
     */
    public clearInitConfig(): void {
        this.initConfig = null;
    }

    /**
     * Clears the discordAPI.
     */
    public clearDiscordAPI(): void {
        this.bot = null;
        if (this.eventCore) {
            this.eventCore.clearClient();
        }
    }
}
