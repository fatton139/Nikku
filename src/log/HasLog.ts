import * as winston from "winston";

export interface HasLog {
    readonly logger: winston.Logger;
}
