import { ICommand } from "../command/ICommand";

export class Command implements ICommand {
    public commandString?: string;
    public action: () => boolean;
    public constructor(action: () => boolean, commandString: string) {
        this.action = action;
        this.commandString = commandString;
    }
    public executeAction(): void {
        this.action();
    }
}
