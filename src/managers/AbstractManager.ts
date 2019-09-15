import * as winston from "winston";

import { NikkuCore } from "../core";
import { Logger } from "../log";
import { BotConfigOptions } from "../config";

export abstract class AbstractManager {
    public readonly logger: winston.Logger = Logger.getNamedLogger(this.constructor);
    protected botConfig: BotConfigOptions;

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
        this.botConfig = NikkuCore.getCoreInstance().getConfig().getBotConfig();
    }

}
