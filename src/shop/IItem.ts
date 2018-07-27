/**
 * Base interface for purchaseable item.
 */
export interface IItem {
    name: string;
    cost: {
        coinType: string,
        value: number
    };
}
