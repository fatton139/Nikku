import * as Discord from "discord.js";
import { config as dotenvConfig } from "dotenv";
import { FortniteBotInitConfig } from "../config/FortniteBotInitConfig";
import { FortniteBotException } from "../exceptions/FortniteBotException";
import { FortniteBotEventCore } from "./FortniteBotEventCore";
import { FortniteBotState } from "../state/FortniteBotState";
import { FortniteBotDbCore } from "./FortniteBotDbCore";
import { FortniteBotDbConfig } from "../config/FortniteBotDbConfig";

export class FortniteBotCore {
    public bot: Discord.Client;
    private coreState: FortniteBotState;
    private initConfig: FortniteBotInitConfig;
    private eventCore: FortniteBotEventCore;
    private DbCore: FortniteBotDbCore;
    public constructor(initConfig: FortniteBotInitConfig) {
        dotenvConfig();
        this.initConfig = initConfig;
        this.bot = new Discord.Client();
        this.eventCore = new FortniteBotEventCore(this);
        const dbConfig = new FortniteBotDbConfig(process.env.dbIp);
        this.DbCore = new FortniteBotDbCore(dbConfig);
    }
    public start(): FortniteBotCore {
        try {
            this.DbCore.connectDb(() => {
                this.bot.login(this.initConfig.botToken);
                this.bot.on("ready", () => {
                    this.eventCore.listenMessages();
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
    public getEventCore(): FortniteBotEventCore {
        return this.eventCore;
    }
    public getDbCore(): FortniteBotDbCore {
        return this.DbCore;
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
}
