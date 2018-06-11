import { ICommand } from "../command/ICommand";

export class Command implements ICommand {
    public commandString?: string;
    public accessLevel: number;
    public action: () => boolean;
    public constructor(action: () => boolean, accessLevel: number,
                       commandString: string) {
        this.action = action;
        this.accessLevel = accessLevel;
        this.commandString = commandString;
    }
    public executeAction(): void {
        try {
            this.action();
        } catch (e) {
            console.log(e);
        }
    }
}
