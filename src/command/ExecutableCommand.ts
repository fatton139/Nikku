import Command from "./Command";
import AccessLevel from "user/AccessLevel";
import IHasAction from "action/IHasAction";

export default class ExecutableCommand extends Command implements IHasAction {
    /**
     * @classdesc Commands which must be executed by a user to run.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, accessLevel: AccessLevel, argLength: number, description: string, helperText?: string) {
        super(accessLevel, argLength, description, helperText);
        this.commandString = commandString;
    }
}
