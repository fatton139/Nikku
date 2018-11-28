import CoreState from "state/CoreState";

export default class Action {
    /**
     * An action to invoke.
     */
    private action: (stateHandle: CoreState, args: string[]) => Promise<boolean>;

    /**
     * @classdesc Base class for a standard action executed by the bot.
     * @param argLength - Number of arguments the action requires.
     * @param action - An action to invoke.
     */
    public constructor(action: (stateHandle: CoreState, args: string[]) => Promise<boolean>) {
        this.action = action;
    }

    /**
     * Executes the action with a set of arguments.
     * @param state - A Handle for the action to bind to.
     * @param args - Arguments to execute the action with.
     * @returns true if the command was successfully executed.
     */
    public async execute(state: CoreState, args: string[]): Promise<boolean> {
        try {
            return await this.action(state, args);
        } catch (err) {
            throw err;
        }
    }
}
