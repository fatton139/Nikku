import { ICommand } from "../commands/ICommand";

export class Command implements ICommand {
    public command: string;
    public action: () => boolean;
    public constructor(command: string, action: () => boolean) {
        this.command = command;
        this.action = action;
    }
    public executeAction(): void {
        this.action();
    }
}
