import { Item } from "./Item";
import { IItem } from "./IItem";

export class Title extends Item implements IItem {
    /**
     * @classdesc A title which can be applied to users.
     * @param name - The name of the title.
     * @param value - The price of the title.
     * @param coinType - The currency required for the title.
     */
    constructor(name: string, value: number, coinType?: string) {
        super(name, value, coinType);
        this.type = "Title";
    }
}
