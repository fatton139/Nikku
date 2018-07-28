export class FortniteBotCommandConfig {
    /**
     * An array of prefixes accepted by the bot.
     */
    private prefix: string[];

    /**
     * @classdesc Initial configuration for commands.
     * @param prefix - The array of prefixes used to call commands.
     */
    public constructor(prefix: string[]) {
        this.prefix = prefix;
    }

    /**
     * Adds a prefix.
     * @param prefix - The prefix to add.
     * @returns true if successfully added.
     */
    public addPrefix(prefix: string): boolean {
        if (prefix as any instanceof String) {
            this.prefix.push(prefix);
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
        const index = this.prefix.indexOf(prefix);
        if (index > -1) {
            this.prefix.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * @return The array of prefixes.
     */
    public getPrefix(): string[] {
        return this.prefix;
    }
}
