import * as winston from "winston";

import { Logger } from "../log";
import { OnMessageState } from "../state";
import { AccessLevel } from "../user";
import { Action, HasAction } from "../action";
import { NikkuException, UnauthorizedExecutionException } from "../exception";
import { CommandInitializer } from "./";

export abstract class AbstractCommand implements HasAction {
    protected readonly logger: winston.Logger = Logger.getNamedLogger(this.constructor);

    /**
     * The required access level to execute this command.
     */
    protected readonly accessLevel: AccessLevel;

    private readonly argLength: number;

    /**
     * Arguments to execute the action with.
     */
    protected args: string[];

    private isEnabled: boolean;

    private description?: string;

    /**
     * An action to execute.
     */
    protected action: Action;

    /**
     * @classdesc Base command class for the bot.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(data: CommandInitializer) {
        this.accessLevel = data.accessLevel;
        this.argLength = data.argLength;
        this.description = data.description;
        this.isEnabled = true;
        this.args = [];
        this.action = new Action(this.setCustomActionFunction);
    }

    /**
     * User specified function.
     * @param state - Core state.
     * @param args - Function arguments extracted.
     */
    public abstract async setCustomActionFunction(state: OnMessageState, args: string[]): Promise<void>;

    /**
     * Execute the action provided by this command.
     * @param user - The user attempting to execute this command.
     */
    public async executeAction(state: OnMessageState, user?: any): Promise<void> {
        if (user && user.accessLevel) {
            if (user.accessLevel < this.accessLevel) {
                throw new UnauthorizedExecutionException(state, this, user);
            }
        }
        try {
            await this.action.execute(state, this.args);
        } catch (err) {
            throw new NikkuException(err.message, err.stack);
        }
    }

    /**
     * Changes the arguments of the command.
     * @param args - New arguments for the command.
     */
    public setArgs(args: string[] | undefined): void {
        this.args = args ? args : [];
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    public getEnabled(): boolean {
        return this.isEnabled;
    }

    public getArgs(): string[] {
        return this.args;
    }

    public getArgLength(): number {
        return this.argLength;
    }

    public getAccessLevel(): AccessLevel {
        return this.accessLevel;
    }

    public getDescription(): string | undefined {
        return this.description;
    }
}
