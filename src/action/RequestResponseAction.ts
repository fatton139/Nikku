import { FortniteBotState } from "../state/FortniteBotState";
import { FortniteBotAction } from "./FortniteBotAction";

export class RequestResponseAction extends FortniteBotAction {
    public constructor(argLength: number,
                       action: (stateHandle: FortniteBotState,
                                args: string[]) => boolean) {
        super(argLength, action);
    }
}
