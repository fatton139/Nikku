import { Item } from "./Item";
import { randInt } from "../utils/Random";

export class Shop {
    /**
     * A array of items offered by the shop.
     */
    public inventory: Item[];

    /**
     * The name of the shop.
     */
    public name: string;

    /**
     * The description of the store.
     */
    public description?: string;

    /**
     * Welcome message to greet a user with.
     */
    public welcomeMessage?: string;

    /**
     * Whether if discounts are allowed for the items.
     */
    public allowDiscounts?: boolean;

    /**
     * The currency the shop accepts.
     */
    private coinType: string;

    /**
     * @classdesc Base class for a shop.
     * @param name - The name of the shop.
     * @param coinType - The currency the shop accepts.
     * @param allowDiscounts - Whether if discounts are allowed for the items.
     * @param description - The description of the store.
     * @param welcomeMessage - Welcome message to greet a user with.
     */
    constructor(name: string, coinType: string, allowDiscounts?: boolean,
                description?: string, welcomeMessage?: string) {
        this.name = name;
        this.coinType = coinType;
        this.description = description;
        this.allowDiscounts = allowDiscounts ? allowDiscounts : false;
        this.inventory = [];
    }

    /**
     * Adds items to the store.
     * @param items - Items to add to the store.
     */
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

    /**
     * Applies discounts to a random set of items.
     * @param amount - The amount of items to apply discounts to.
     */
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

    /**
     * Resets all discounts for items.
     */
    public resetDiscount(): void {
        for (const item of this.inventory) {
            item.discountPercent = 0;
        }
    }

    /**
     * Gets the inventory of the store.
     * @returns A string representation of all the items in the store.
     */
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
