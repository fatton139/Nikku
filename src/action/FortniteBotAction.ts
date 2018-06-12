export class FortniteBotAction {
    public argLength: number;
    public action: (args: string[]) => boolean;
    public constructor(argLength: number, action: (args: string[]) => boolean) {
        this.argLength = argLength;
        this.action = action;
    }
    public execute(args: string[]): boolean {
        return this.action(args);
    }
}
