import * as Discord from "discord.js";

import { CoreState, OnMessageState } from "../state";
import { NikkuException } from "../exception";
import { AsyncUserSpecifiedFunction } from "./";

export class Action<T = void, S extends CoreState<Discord.Message> = OnMessageState> {
    /**
     * An action to invoke.
     */
    protected task: AsyncUserSpecifiedFunction<T>;

    /**
     * @classdesc Base class for a standard action executed by the bot.
     * @param argLength - Number of arguments the action requires.
     * @param action - An action to invoke.
     */
    public constructor(task: AsyncUserSpecifiedFunction<T>) {
        this.task = task;
    }

    /**
     * Executes the action with a set of arguments.
     * @param state - A Handle for the action to bind to.
     * @param args - Arguments to execute the action with.
     * @returns true if the command was successfully executed.
     */
    public async execute(state: S, args: string[]): Promise<T> {
        try {
            return await this.task(state, args);
        } catch (err) {
            throw new NikkuException(`Action failed to execute.`);
        }
    }

    public getTask(): AsyncUserSpecifiedFunction<T> {
        return this.task;
    }
}
