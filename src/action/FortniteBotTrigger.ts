import { FortniteBotAction } from "./FortniteBotAction";
import { FortniteBotState } from "../state/FortniteBotState";

export class FortniteBotTrigger extends FortniteBotAction {
    /**
     * @classdesc Base trigger class, invokes an FortniteBotAction if conditions are met.
     * @param trigger - A trigger to invoke, returns true if conditions are met.
     */
    public constructor(trigger: (state: FortniteBotState) => boolean) {
        super(0, trigger);
    }

    /**
     * Attempt to execute the trigger.
     * @param state A Handle for the trigger to bind to.
     * @returns true if the command was successfully executed.
     */
    public execute(state: FortniteBotState): boolean {
        return super.execute(state, null);
    }
}
