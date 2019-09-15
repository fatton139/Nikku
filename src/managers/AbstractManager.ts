import * as winston from "winston";

import { NikkuCore } from "../core";
import { Logger } from "../log";
import { BotConfigOptions } from "../config";

export abstract class AbstractManager {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    protected botConfig: BotConfigOptions;

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
        this.botConfig = NikkuCore.getCoreInstance().getConfig().getBotConfig();
    }

}
