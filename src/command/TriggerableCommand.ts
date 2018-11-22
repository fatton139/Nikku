import Command from "./Command";
import Action from "action/Action";
import Trigger from "action/Trigger";
import NikkuCore from "core/NikkuCore";
import IHasAction from "./IHasAction";
import IHasTrigger from "./IHasTrigger";

export default class TriggerableCommand extends Command implements IHasAction, IHasTrigger {

    protected trigger: Trigger;

    /**
     * @classdesc Commands which are triggered without user directly calling it.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     * @param trigger - The condition required to execute the action.
     */
    public constructor(accessLevel: number) {
        super(accessLevel, 0);
        this.trigger = this.setCustomTrigger();
    }

    public tryTrigger(core: NikkuCore): boolean {
        return this.trigger.execute(core.getCoreState());
    }

    public setCustomTrigger(): Trigger {
        return;
    }
}
