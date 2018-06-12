export class FortniteBotAction {
    public argLength: number;
    public action: (args) => boolean;
    public constructor(argLength: number, action: (args) => boolean) {
        this.argLength = argLength;
        this.action = action;
    }
    public execute(args: string[]): boolean {
        return this.action(args);
    }
}
