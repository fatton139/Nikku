import { ICommand } from "./ICommand";
import { Command } from "./Command";
import Action from "action/Action";
import Trigger from "action/Trigger";
import { core } from "core/NikkuCore";

export default class TriggerableCommand extends Command {
    /**
     * @classdesc Commands which are triggered without user directly calling it.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     * @param trigger - The condition required to execute the action.
     */
    public constructor(accessLevel: number,
                       action: Action, trigger: Trigger) {
        super(undefined, accessLevel, 0, action);
        this.trigger = trigger;
    }
}
