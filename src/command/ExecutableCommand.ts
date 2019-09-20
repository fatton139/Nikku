import { Action, HasAction } from "../action";
import { OnMessageState } from "../state";
import { AbstractCommand, ExecutableCommandInitializer } from "./";

export abstract class ExecutableCommand extends AbstractCommand implements HasAction {
    private usage?: string;

    /**
     * @classdesc Commands which must be executed by a user to run.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(data: ExecutableCommandInitializer) {
        super(data);
        this.commandString = data.commandString;
        this.usage = data.usage;
    }

    public abstract setCustomAction(): Action;

    public getUsage(): string | undefined {
        return this.usage;
    }

    public displayUsageText(message: OnMessageState): void {
        message.getHandle().reply(this.usage ? this.usage : "Invalid command usage.");
    }
}
