import * as winston from "winston";
import { Logger } from "log";
import { Nikku } from "core";

export default abstract class AbstractManager {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    protected core: Nikku.Core;

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
        this.core = Nikku.coreInstance;
    }

}
