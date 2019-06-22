import ObjectRegistry from "registries/ObjectRegistry";
import DynamicImportManager from "./DynamicImportManager";
import { Config } from "config/NikkuConfig";
import BaseObject from "objects/AbstractBaseObject";

export default class ObjectManager extends DynamicImportManager {
    private objectRegistry: ObjectRegistry;

    public constructor() {
        super(Config.Items.DIR_PATH, Config.Items.MODULE_PATHS);
        this.objectRegistry = new ObjectRegistry();
    }

    public async loadItems(): Promise<void> {
        const importPaths: string[] = this.getImportPaths();
        this.logger.info(`Detected ${importPaths.length}` +
            ` ${importPaths.length === 1 ? "item" : "items"} for import.`);
        for (const path of importPaths) {
            const baseObjectClass = await import(`${this.DIR_PATH}/${path}`);
            if (!baseObjectClass.default) {
                this.logger.warn(`Fail to add item. "${this.DIR_PATH}/${path}" has no default export.`);
            } else if (!(new baseObjectClass.default() instanceof BaseObject)) {
                this.logger.warn(`Fail to add item. "${this.DIR_PATH}/${path}" exported class is not of type "BaseObject".`);
            } else {
                this.objectRegistry.addObject(new baseObjectClass.default());
            }
        }
        this.logger.info(`Successfully imported ${this.objectRegistry.getRegistrySize()} ` +
            `out of ${importPaths.length} ${importPaths.length === 1 ? "item" : "items"}.`);
    }

    // public async useItem(itemName: string, target: string): Promise<void> {
    //     //
    // }
}
