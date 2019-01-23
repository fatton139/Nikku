import * as winston from "winston";
import Logger from "log/Logger";

export default class BaseRegistry {

    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    protected registry: Map<string, any>;

    public constructor() {
        this.logger = this.logger.debug(`${this.constructor.name} registry initialized.`);
    }

    public keyExists(name: string): boolean {
        return this.registry.has(name);
    }

    public getRegistryMap(): Map<string, any> {
        return this.registry;
    }

    public getElementByKey(name: string): any {
        return this.registry.get(name);
    }

    public getRegistrySize(): number {
        return this.registry.size;
    }
}
