import * as winston from "winston";
import { Logger } from "log";

export default class BaseRegistry<T> {

    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    protected registry: Map<string, T>;

    public constructor() {
        this.logger = this.logger.debug(`${this.constructor.name} registry initialized.`);
        this.registry = new Map<string, T>();
    }

    protected getLogger(): winston.Logger {
        return this.logger;
    }

    public getRegistry(): Map<string, T> {
        return this.registry;
    }

    public keyExists(name: string): boolean {
        return this.registry.has(name);
    }

    public getElementByKey(name: string): T | undefined {
        return this.registry.get(name);
    }

    public getRegistrySize(): number {
        return this.registry.size;
    }
}
