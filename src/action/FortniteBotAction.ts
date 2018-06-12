import { FortniteBotState } from "../state/FortniteBotState";

export class FortniteBotAction {
    public argLength: number;
    public action: (stateHandle: FortniteBotState, args: string[]) => boolean;
    public constructor(argLength: number,
                       action: (stateHandle: FortniteBotState,
                                args: string[]) => boolean) {
        this.argLength = argLength;
        this.action = action;
    }
    public execute(state: FortniteBotState, args: string[]): boolean {
        return this.action(state, args);
    }
}
