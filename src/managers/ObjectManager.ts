import ObjectRegistry from "registries/ObjectRegistry";
import DynamicImportManager from "./DynamicImportManager";
import { Config } from "config/Config";

export default class ObjectManager extends DynamicImportManager {
    private objectRegistry: ObjectRegistry;

    public constructor() {
        super(Config.Items.DIR_PATH, Config.Items.MODULE_PATHS);
        this.objectRegistry = new ObjectRegistry();
    }

    public async loadObjects(): Promise<void> {
        //
    }
}
