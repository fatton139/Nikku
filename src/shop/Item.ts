import { IItem } from "./IItem";

export class Item implements IItem {
    public name: string;
    public cost: {
        coinType: string,
        value: number
    };
    public discountPercent: number;
    public type: string;
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
    public getPrice(): number {
        return Math.round(this.cost.value -
            (this.cost.value * (this.discountPercent / 100))
        );
    }
}
