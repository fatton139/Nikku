import Action from "action/Action";
import CoreState from "state/CoreState";

export default class Trigger extends Action {
    /**
     * @classdesc Base trigger class, invokes an FortniteBotAction if conditions are met.
     * @param trigger - A trigger to invoke, returns true if conditions are met.
     */
    public constructor(trigger: (state: CoreState) => boolean) {
        super(0, trigger);
    }

    /**
     * Attempt to execute the trigger.
     * @param state A Handle for the trigger to bind to.
     * @returns true if the command was successfully executed.
     */
    public execute(state: CoreState): boolean {
        return super.execute(state, undefined);
    }
}
