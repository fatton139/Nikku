import { FortniteBotAction } from "./FortniteBotAction";
import { FortniteBotState } from "../state/FortniteBotState";

export class FortniteBotTrigger extends FortniteBotAction {
    public constructor(trigger: (state: FortniteBotState) => boolean) {
        super(0, trigger);
    }
    public execute(state: FortniteBotState): boolean {
        return super.execute(state, null);
    }
}
