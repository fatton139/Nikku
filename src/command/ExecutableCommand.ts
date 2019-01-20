import Command from "./Command";
import { AccessLevel } from "user/AccessLevel";
import IHasAction from "action/IHasAction";
import OnMessageState from "state/OnMessageState";

export default class ExecutableCommand extends Command implements IHasAction {
    private usage: string;
    /**
     * @classdesc Commands which must be executed by a user to run.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, accessLevel: AccessLevel, argLength: number, description: string, usage?: string) {
        super(accessLevel, argLength, description);
        this.commandString = commandString;
        this.usage = usage;
    }

    public getUsage(): string {
        return this.usage;
    }

    public displayUsageText(msg: OnMessageState): void {
        msg.getMessageHandle().reply(this.usage);
    }
}
