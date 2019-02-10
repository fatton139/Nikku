import BaseObject from "./AbstractBaseObject";
import { IUsableObject } from "./IUsableObject";

export default class BaseItem extends BaseObject implements IUsableObject {

    public constructor() {
        super({
            name: "test",
        });
    }

    public onUse(): void {
        return;
    }

}
