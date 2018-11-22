import * as Discord from "discord.js";
import { DBUserSchema as User, DBUserSchema } from "database/schemas/DBUserSchema";
import UnauthorizedCommandException from "exception/UnauthorizedCommandException";
import Action from "action/Action";
import NikkuException from "exception/NikkuException";
import NikkuCore from "core/NikkuCore";
import { AccessLevel } from "user/AccessLevel";
import Trigger from "action/Trigger";
import OnMessageState from "state/OnMessageState";

export class Command {
    /**
     * The string required to execute this command.
     */
    private readonly commandString?: string;

    /**
     * The required access level to execute this command.
     */
    private readonly accessLevel: AccessLevel;

    /**
     * An action to execute.
     */
    protected action: Action;

    protected trigger: Trigger;

    private readonly argLength: number;

    /**
     * Arguments to execute the action with.
     */
    private args: string[];

    private isEnabled: boolean;

    /**
     * @classdesc Base command class for the bot.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, accessLevel: AccessLevel, argLength: number, action: Action) {
        this.action = action;
        this.accessLevel = accessLevel;
        this.argLength = argLength;
        this.commandString = commandString;
    }

    /**
     * Changes the arguments of the command.
     * @param args - New arguments for the command.
     */
    public setArgs(args: string[]): void {
        this.args = args ? args : [];
    }

    /**
     * Execute the action provided by this command.
     * @param user - The user attempting to execute this command.
     */
    public async executeAction(core: NikkuCore, user?: User): Promise<void> {
        if (user.getAccessLevel() < this.accessLevel) {
            throw new UnauthorizedCommandException(core.getCoreState(), this, user);
        }
        if (!this.action.execute(core.getCoreState(), this.args)) {
            throw new NikkuException(core.getCoreState(), "Failed Execution");
        }
    }

    public async executeActionNoUser(core: NikkuCore) {
        const tempUser = new User();
        tempUser.setAccessLevel(AccessLevel.UNREGISTERED);
        if (tempUser.getAccessLevel() >= this.accessLevel) {
            if (!this.action.execute(core.getCoreState(), this.args)) {
                throw new NikkuException(core.getCoreState(), "Failed Execution");
            }
        }
    }

    public executeActionNoWarning(core: NikkuCore, user?: User): void {
        if (user.getAccessLevel() >= this.accessLevel) {
            this.action.execute(core.getCoreState(), this.args);
        }
    }

    public tryTrigger(core: NikkuCore): boolean {
        return this.trigger.execute(core.getCoreState());
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

    public getCommandString(): string {
        return this.commandString;
    }

    public getAccessLevel(): AccessLevel {
        return this.accessLevel;
    }
}
