import * as winston from "winston";
import Logger from "log/Logger";
import { Config } from "config/Config";
import NikkuCore, { core } from "core/NikkuCore";

export default class BaseManager {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    protected core: NikkuCore;

    protected config: typeof Config;

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
        this.core = core;
        this.config = Config;
    }

    public getManager(): BaseManager {
        return this;
    }
}
