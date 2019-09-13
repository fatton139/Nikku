import * as winston from "winston";

import { Logger } from "../log";

export abstract class AbstractManager {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    public constructor() {
        this.logger.debug(`${this.constructor.name} manager initialized.`);
    }

}
