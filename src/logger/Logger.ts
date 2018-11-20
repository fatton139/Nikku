import * as winston from "winston";

const { combine, timestamp, label, printf } = winston.format;

export class Logger {
    private readonly logger: winston.Logger;
    public constructor(className: string) {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.colorize(),
                label({ label: className }),
                timestamp(),
                printf((info) => {
                    return `${info.timestamp}:${info.label}:${info.level}:${info.message}`;
                }),
            ),
            transports: [
                new winston.transports.File({
                    filename: "debug.log",
                    level: "info",
                }),
                new winston.transports.Console({
                    level: "debug",
                }),
            ],
        });
    }
    public getLogger(): winston.Logger {
        return this.logger;
    }
}
