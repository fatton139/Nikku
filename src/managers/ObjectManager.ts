import BaseManager from "./BaseManager";
import ObjectRegistry from "registries/ObjectRegistry";

export default class ObjectManager extends BaseManager {
    private objectRegistry: ObjectRegistry;

    public constructor() {
        super();
        this.objectRegistry = new ObjectRegistry();
    }

    public async loadObjects(): Promise<void> {
        //
    }
}
