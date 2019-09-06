import BaseObject from "./AbstractBaseObject";
import { UsableObject } from "./UsableObject";

export default class BaseItem extends BaseObject implements UsableObject {

    public constructor() {
        super({
            name: "NOT IMPLEMENTED",
        });
    }

    public onUse(): void {
        return;
    }

}
