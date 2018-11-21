import { ICommand } from "./ICommand";
import { Command } from "./Command";
import Action from "action/Action";
import Trigger from "action/Trigger";
import { core } from "core/NikkuCore";

export default class TriggerableCommand extends Command implements ICommand {
    /**
     * The condition required to execute the action.
     */
    public trigger: Trigger;

    /**
     * @classdesc Commands which are triggered without user directly calling it.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     * @param trigger - The condition required to execute the action.
     */
    public constructor(accessLevel: number,
                       action: Action, trigger: Trigger) {
        super(undefined, accessLevel, action);
        this.trigger = trigger;
    }

    /**
     * Attempt to execute the trigger.
     * @returns true if conditions of the trigger has been met.
     */
    public tryTrigger(): boolean {
        return this.trigger.execute(core.getCoreState());
    }
}
