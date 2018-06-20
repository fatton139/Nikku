import { Item } from "./Item";
import { IItem } from "./IItem";

export class Title extends Item implements IItem {
    constructor(name: string, value: number, coinType?: string) {
        super(name, value, coinType);
        this.type = "Title";
    }
}
