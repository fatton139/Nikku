export function randInt(min, max): number {
    return Math.floor(Math.random() * (max - min)) + min;
}
