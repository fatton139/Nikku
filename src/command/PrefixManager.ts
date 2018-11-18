import { throws } from "assert";

export class PrefixManager {
    /**
     * An array of prefixes accepted by the bot.
     */
    private prefixes: string[];

    /**
     * @classdesc Initial configuration for commands.
     * @param prefix - The array of prefixes used to call commands.
     */
    public constructor(prefix: string[]) {
        this.prefixes = prefix;
    }

    /**
     * Adds a prefix.
     * @param prefix - The prefix to add.
     * @returns true if successfully added.
     */
    public addPrefix(prefix: string): boolean {
        if (prefix as any instanceof String && this.prefixes.indexOf(prefix) === -1) {
            this.prefixes.push(prefix);
            return true;
        }
        return false;
    }

    /**
     * Removes a prefix.
     * @param prefix - The prefix to remove.
     * @returns true if successfully removed.
     */
    public removePrefix(prefix: string): boolean {
        const index = this.prefixes.indexOf(prefix);
        if (index > -1) {
            this.prefixes.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * @return The array of prefixes.
     */
    public getPrefix(): string[] {
        return this.prefixes;
    }
}
