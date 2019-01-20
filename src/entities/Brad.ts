import { Config } from "config/Config";

export default class Brad {
    public static dotmaCoinsToKg(amount: number): number {
        return (1 / Math.exp(8)) * amount;
    }

    public static weightGained(weight: number): number {
        return Math.floor(weight - Config.Brad.DEFAULT_WEIGHT);
    }
}
