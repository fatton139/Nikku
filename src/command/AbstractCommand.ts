import * as winston from "winston";
import { Logger } from "log";
import DBUserSchema from "database/schemas/DBUserSchema";
import { NikkuException, UnauthorizedCommandException } from "exception";
import { Action, HasAction } from "action";
import { AccessLevel } from "user/AccessLevel";
import { OnMessageState } from "state";
import { CommandConstructorData } from "./CommandConstructorData";

export default abstract class AbstractCommand implements HasAction {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    /**
     * The string required to execute this command.
     */
    protected commandString?: string;

    /**
     * The required access level to execute this command.
     */
    private readonly accessLevel: AccessLevel;

    /**
     * An action to execute.
     */
    protected action: Action;

    private readonly argLength: number;

    /**
     * Arguments to execute the action with.
     */
    private args: string[];

    private isEnabled: boolean;

    private description?: string;

    /**
     * @classdesc Base command class for the bot.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(data: CommandConstructorData.Base) {
        this.action = this.setCustomAction();
        this.accessLevel = data.accessLevel;
        this.argLength = data.argLength;
        this.isEnabled = true;
        this.args = [];
        this.description = data.description;
    }

    /**
     * Changes the arguments of the command.
     * @param args - New arguments for the command.
     */
    public setArgs(args: string[]): void {
        this.args = args ? args : [];
    }

    public getCommandString(): string | undefined {
        return this.commandString;
    }

    /**
     * Execute the action provided by this command.
     * @param user - The user attempting to execute this command.
     */
    public async executeAction(msg: OnMessageState, user?: DBUserSchema): Promise<void> {
        if (user && user.accessLevel) {
            if (user.accessLevel < this.accessLevel) {
                throw new UnauthorizedCommandException(msg, this, user);
            }
        }
        try {
            const status = await this.action.execute(msg, this.args);
            if (!status) {
                throw new NikkuException("Failed execution.");
            }
        } catch (err) {
            throw err;
        }

    }

    public async executeActionNoUser(msg: OnMessageState): Promise<void> {
        const tempUser = new DBUserSchema();
        if (AccessLevel.UNREGISTERED >= this.accessLevel) {
            return this.executeAction(msg, tempUser);
        }
    }

    public async executeActionNoWarning(msg: OnMessageState, user?: DBUserSchema): Promise<void> {
        if (user && user.accessLevel) {
            if (user.accessLevel >= this.accessLevel) {
                await this.action.execute(msg, this.args);
            }
        }
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

    public setCustomAction(): Action {
        return this.action;
    }
}
