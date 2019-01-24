import BaseRegistry from "./BaseRegistry";
import BaseObject from "objects/BaseObject";

export default class ObjectRegistry extends BaseRegistry<BaseObject> {

    public constructor() {
        super();
    }

    public addObject(object: BaseObject): void {
        this.registry.set(object.getName(), object);
    }
}
