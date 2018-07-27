import { FortniteBotState } from "../state/FortniteBotState";
import { FortniteBotAction } from "./FortniteBotAction";

export class RequestResponseAction extends FortniteBotAction {
    /**
     * @classdesc An action which requires a user response.
     * @param argLength - Number of arguments the action requires.
     * @param action - An action to invoke.
     */
    public constructor(argLength: number,
                       action: (stateHandle: FortniteBotState,
                                args: string[]) => boolean) {
        super(argLength, action);
    }
}
