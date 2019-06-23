import * as winston from "winston";
import { Logger } from "log";
import { NikkuCore, core } from "core/NikkuCore";

export default abstract class AbstractManager {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    protected core: NikkuCore;

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
        this.core = core;
    }

}
