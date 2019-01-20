export namespace MathUtil {
    export const zeros = (row: number, col: number, value?: number): number[][] => {
        return Array(col).fill([]).map(() => Array(row).fill(value ? value : 0));
    };

    export const randInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

}
