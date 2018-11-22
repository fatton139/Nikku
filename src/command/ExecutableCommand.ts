import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";
import Action from "../action/Action";
import { AccessLevel } from "user/AccessLevel";

export class ExecutableCommand extends Command implements ICommand {
    /**
     * @classdesc Commands which must be executed by a user to run.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, accessLevel: AccessLevel, argLength: number, action: Action) {
        super(commandString, accessLevel, argLength, action);
    }
}
