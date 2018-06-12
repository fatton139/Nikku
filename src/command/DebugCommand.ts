import { ICommand } from "./ICommand";
import { ExecutableCommand } from "./ExecutableCommand";

export class DebugCommand extends ExecutableCommand implements ICommand {
    public constructor(commandString: string, action: () => boolean) {
        super(commandString, 3, action);
    }
}
