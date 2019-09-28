import { OnMessageState } from "../state";
import { NikkuException } from "../exception";

export class Action<S = OnMessageState> {
    /**
     * An action to invoke.
     */
    private action: (state: S, args: string[]) => Promise<void>;

    /**
     * @classdesc Base class for a standard action executed by the bot.
     * @param argLength - Number of arguments the action requires.
     * @param action - An action to invoke.
     */
    public constructor(action: (state: S, args: string[]) => Promise<void>) {
        this.action = action;
    }

    /**
     * Executes the action with a set of arguments.
     * @param state - A Handle for the action to bind to.
     * @param args - Arguments to execute the action with.
     * @returns true if the command was successfully executed.
     */
    public async execute(state: S, args: string[]): Promise<void> {
        try {
            await this.action(state, args);
        } catch (err) {
            throw new NikkuException(`Action failed to execute.`);
        }
    }
}
