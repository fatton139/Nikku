import { Trigger, HasAction, HasTrigger } from "../action";
import { OnMessageState } from "../state";

import { AbstractCommand } from "./";

export class TriggerableCommand extends AbstractCommand implements HasAction, HasTrigger {

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
        this.trigger = this.setCustomTrigger();
    }

    public async tryTrigger(msg: OnMessageState): Promise<boolean> {
        return this.trigger.execute(msg);
    }

    public setCustomTrigger(): Trigger {
        return this.trigger;
    }
}
