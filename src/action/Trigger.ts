import { OnMessageState } from "../state";
import { Action, AsyncUserSpecifiedFunction } from "./";

export class Trigger extends Action<boolean> {

    /**
     * @classdesc Base trigger class, invokes an Action if trigger conditions are met.
     * @param trigger - A trigger to invoke, returns true if conditions are met.
     */
    public constructor(triggerTask: AsyncUserSpecifiedFunction<boolean>) {
        super(triggerTask);
    }

    /**
     * Attempt to execute the trigger.
     * @param state A Handle for the trigger to bind to.
     * @returns true if the command was successfully executed.
     */
    public async execute(state: OnMessageState, args: string[]): Promise<boolean> {
        return super.execute(state, args);
    }
}
