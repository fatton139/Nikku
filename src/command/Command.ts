import * as winston from "winston";
import Logger from "log/Logger";
import DBUserSchema from "database/schemas/DBUserSchema";
import UnauthorizedCommandException from "exception/UnauthorizedCommandException";
import Action from "action/Action";
import NikkuException from "exception/NikkuException";
import NikkuCore from "core/NikkuCore";
import AccessLevel from "user/AccessLevel";
import IHasAction from "action/IHasAction";

export default class Command implements IHasAction {
    protected logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    /**
     * The string required to execute this command.
     */
    protected commandString: string;

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

    private description: string;

    private helperText: string;

    /**
     * @classdesc Base command class for the bot.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(accessLevel: AccessLevel, argLength: number, description?: string, helperText?: string) {
        this.action = this.setCustomAction();
        this.accessLevel = accessLevel;
        this.argLength = argLength;
        this.description = description;
        this.helperText = helperText;
    }

    /**
     * Changes the arguments of the command.
     * @param args - New arguments for the command.
     */
    public setArgs(args: string[]): void {
        this.args = args ? args : [];
    }

    public getCommandString(): string {
        return this.commandString;
    }

    /**
     * Execute the action provided by this command.
     * @param user - The user attempting to execute this command.
     */
    public async executeAction(core: NikkuCore, user?: DBUserSchema): Promise<void> {
        if (user.accessLevel < this.accessLevel) {
            throw new UnauthorizedCommandException(core.getCoreState(), this, user);
        }
        try {
            const status = await this.action.execute(core.getCoreState(), this.args);
            if (!status) {
                throw new NikkuException(core.getCoreState(), "Failed execution.");
            }
        } catch (err) {
            throw err;
        }

    }

    public async executeActionNoUser(core: NikkuCore): Promise<void> {
        const tempUser = new DBUserSchema();
        if (AccessLevel.UNREGISTERED >= this.accessLevel) {
            return await this.executeAction(core, tempUser);
        }
    }

    public executeActionNoWarning(core: NikkuCore, user?: DBUserSchema): void {
        if (user.accessLevel >= this.accessLevel) {
            this.action.execute(core.getCoreState(), this.args);
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

    public getDescription(): string {
        return this.description;
    }

    public setCustomAction(): Action {
        return;
    }

    public getHelperText(): string {
        return this.helperText;
    }
}
