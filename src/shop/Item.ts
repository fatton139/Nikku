import { IItem } from "./IItem";

export class Item implements IItem {
    /**
     * The name of the item.
     */
    public name: string;

    /**
     * The price property of the item.
     */
    public cost: {
        coinType: string,
        value: number
    };

    /**
     * Discounts applied to the value of the item.
     */
    public discountPercent: number;

    /**
     * The type associated with the item.
     */
    public type: string;

    /**
     * @classdesc Base class for a purchaseable item.
     * @param name - The name of the item.
     * @param value - The value of the item.
     * @param coinType - The type of currency for this item. Overrides the shop currency.
     */
    constructor(name: string, value: number, coinType?: string) {
        this.name = name;
        this.cost = {
            coinType,
            value
        };
        this.discountPercent = 0;
        if (!coinType) {
            this.cost.coinType = null;
        }
    }

    /**
     * Gets the acutal price of the item.
     */
    public getPrice(): number {
        return Math.round(this.cost.value -
            (this.cost.value * (this.discountPercent / 100))
        );
    }
}
