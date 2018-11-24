import * as Discord from "discord.js";
import DBUserSchema from "database/schemas/DBUserSchema";
import UnauthorizedCommandException from "exception/UnauthorizedCommandException";
import Action from "action/Action";
import NikkuException from "exception/NikkuException";
import NikkuCore from "core/NikkuCore";
import AccessLevel from "user/AccessLevel";
import Trigger from "action/Trigger";
import OnMessageState from "state/OnMessageState";
import IHasAction from "./IHasAction";

export default class Command implements IHasAction {
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

    /**
     * @classdesc Base command class for the bot.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(accessLevel: AccessLevel, argLength: number, description?: string) {
        this.action = this.setCustomAction();
        this.accessLevel = accessLevel;
        this.argLength = argLength;
        this.description = description;
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
    public executeAction(core: NikkuCore, user?: DBUserSchema): void {
        if (user.getAccessLevel() < this.accessLevel) {
            throw new UnauthorizedCommandException(core.getCoreState(), this, user);
        }
        this.action.execute(core.getCoreState(), this.args).then((status: boolean) => {
            if (!status) {
                console.log(status);
                throw new NikkuException(core.getCoreState(), "Failed Execution");
            }
        });

    }

    public executeActionNoUser(core: NikkuCore): void {
        const tempUser = new DBUserSchema();
        tempUser.setAccessLevel(AccessLevel.UNREGISTERED);
        if (tempUser.getAccessLevel() >= this.accessLevel) {
            if (!this.action.execute(core.getCoreState(), this.args)) {
                throw new NikkuException(core.getCoreState(), "Failed Execution");
            }
        }
    }

    public executeActionNoWarning(core: NikkuCore, user?: DBUserSchema): void {
        if (user.getAccessLevel() >= this.accessLevel) {
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
}
