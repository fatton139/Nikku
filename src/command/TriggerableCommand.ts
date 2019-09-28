import { Trigger, HasAction, HasTrigger } from "../action";
import { OnMessageState } from "../state";

import { AbstractCommand } from "./";

export abstract class TriggerableCommand extends AbstractCommand implements HasAction, HasTrigger {

    protected trigger: Trigger;

    /**
     * @classdesc Commands which are triggered without user directly calling it.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     * @param trigger - The condition required to execute the action.
     */
    public constructor(accessLevel: number) {
        super({
            accessLevel,
            argLength: 0,
        });
        this.trigger = new Trigger(this.setCustomTriggerFunction);
    }

    public async triggerConditionMet(state: OnMessageState, args: string[]): Promise<boolean> {
        return this.trigger.execute(state, args);
    }

    public abstract setCustomTriggerFunction(state: OnMessageState, args: string[]): Promise<boolean>;
}
