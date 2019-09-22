import * as winston from "winston";
import { Logger } from "../log";
import { NikkuException } from "../exception";

export class ExceptionHandler {
    public readonly logger: winston.Logger = Logger.getLogger(ExceptionHandler);

    private showStack: boolean;

    public constructor(showStack: boolean = false) {
        this.showStack = showStack;
    }

    private handleNikkuException(error: NikkuException, logger: winston.Logger): void {
        if (error.message) {
            logger.error(error.message);
        }
        if (error.stack && this.showStack) {
            logger.info(error.stack);
        }
    }

    private handleGeneralException(error: Error, logger: winston.Logger): void {
        logger.error(error.message);
    }

    public handleTopLevel(error: Error, classLogger?: winston.Logger): void {
        const logger: winston.Logger = classLogger ? classLogger : this.logger;
        if (error instanceof NikkuException) {
            return this.handleNikkuException(error, logger);
        }
        return this.handleGeneralException(error, logger);
    }
}
