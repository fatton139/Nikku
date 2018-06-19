import { Item } from "./Item";
import { randInt } from "../utils/Random";

export class Shop {
    public inventory: Item[];
    public name: string;
    public description?: string;
    public allowDiscounts: boolean;
    private coinType: string;
    constructor(name: string, coinType: string, allowDiscounts?: boolean,
                description?: string) {
        this.name = name;
        this.coinType = coinType;
        this.description = description;
        this.allowDiscounts = allowDiscounts ? allowDiscounts : false;
        this.inventory = [];
    }
    public addItems(items: Item[]): void {
        for (const item of items) {
            if (this.inventory.indexOf(item) === -1) {
                if (!item.cost.coinType) {
                    item.cost.coinType = this.coinType;
                }
                this.inventory.push(item);
            }
        }
    }
    public setRandomDiscount(amount: number): void {
        this.resetDiscount();
        const itemIndex = [];
        let i = 0;
        while (i < amount) {
            const index = randInt(0, this.inventory.length);
            if (itemIndex.indexOf(index) !== -1) {
                continue;
            }
            itemIndex.push(index);
            this.inventory[index].discountPercent = 90 - (2 * i) > 20 ?
                Math.ceil(randInt(5, 90 - (2 * i)) / 5) * 5 :
                Math.ceil(randInt(5, 20) / 5) * 5;
            i++;
        }
    }
    public resetDiscount(): void {
        for (const item of this.inventory) {
            item.discountPercent = 0;
        }
    }
    public getInventory(): string {
        let text = this.name + "\n";
        let i = 0;
        for (const item of this.inventory) {
            text += i + ". " + item.getPrice() + " " + item.cost.coinType +
                " - " + item.name;
            if (item.discountPercent > 0) {
                text += " (" + item.discountPercent + "% off!)";
            }
            text += "\n";
            i++;
        }
        return text;
    }
}
