import { FortniteBotState } from "../state/FortniteBotState";

export class FortniteBotAction {
    /**
     * Number of arguments this action requires.
     */
    public argLength: number;

    /**
     * An action to invoke.
     */
    public action: (stateHandle: FortniteBotState, args: string[]) => boolean;

    /**
     * @classdesc Base class for a standard action executed by the bot.
     * @param argLength - Number of arguments the action requires.
     * @param action - An action to invoke.
     */
    public constructor(argLength: number,
                       action: (stateHandle: FortniteBotState,
                                args: string[]) => boolean) {
        this.argLength = argLength;
        this.action = action;
    }

    /**
     * Executes the action with a set of arguments.
     * @param state - A Handle for the action to bind to.
     * @param args - Arguments to execute the action with.
     * @returns true if the command was successfully executed.
     */
    public execute(state: FortniteBotState, args: string[]): boolean {
        return this.action(state, args);
    }
}
