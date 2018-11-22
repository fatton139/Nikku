import * as moment from "moment";
import * as winston from "winston";
import ChannelTransport from "./ChannelTransport";

export default class Logger {
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
    }
    public getLogger(): winston.Logger {
        return this.logger;
    }
}
