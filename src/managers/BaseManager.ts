import * as winston from "winston";
import Logger from "log/Logger";
import NikkuCore, { core } from "core/NikkuCore";

export default class BaseManager {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    protected core: NikkuCore;

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
        this.core = core;
    }

    public getManager(): BaseManager {
        return this;
    }
}
