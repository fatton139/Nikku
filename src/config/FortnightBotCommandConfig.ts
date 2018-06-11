export class FortnightBotCommandConfig {
    private prefix: string[];
    public constructor(prefix: string[]) {
        this.prefix = prefix;
    }
    public addPrefix(prefix: string): boolean {
        if (prefix as any instanceof String) {
            this.prefix.push(prefix);
            return true;
        }
        return false;
    }
    public removePrefix(prefix: string): boolean {
        const index = this.prefix.indexOf(prefix);
        if (index > -1) {
            this.prefix.splice(index, 1);
            return true;
        }
        return false;
    }
}
