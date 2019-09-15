import * as moment from "moment";
import * as winston from "winston";

import { ChannelTransport, HasLog } from "./";

export class Logger {
    private readonly logger: winston.Logger;

    public constructor(className: string) {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.label({ label: className }),
            ),
            transports: [
                new winston.transports.File({
                    filename: "debug.log",
                    level: "info",
                    format: winston.format.combine(
                        winston.format.printf((info) => {
                            return `${moment().format()}:${info.label}:${info.level}:${info.message}`;
                        }),
                    ),
                }),
                new winston.transports.Console({
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf((info) => {
                            return `${moment().format()}:${info.label}:${info.level}:${info.message}`;
                        }),
                    ),
                }),
                new ChannelTransport({
                    level: "debug",
                }),
            ],
        });
        if (process.env.NODE_ENV === "TEST") {
            for (const t of this.logger.transports) {
                t.silent = true;
            }
        }
    }

    public static getNamedLogger(constructor: Function): winston.Logger {
        return new Logger(constructor.name).logger;
    }

    public static getLogger<T extends HasLog | Function>(cls: (Function & {prototype: T})): winston.Logger {
        return new Logger(cls.name).logger;
    }
}
