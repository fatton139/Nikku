import { Command } from "./Command";
import TriggerableCommand from "./TriggerableCommand";

export class CommandRegistry {
    private commands: Map<string, Command>;

    public constructor() {
        this.commands = new Map<string, Command>();
    }

    public addCommand(name: string, command: Command): boolean {
        if (!this.commands.has(name) && name && name.length !== 0) {
            this.commands.set(name, command);
            return true;
        }
        return false;
    }

    public addCommandMulti(commands: Command[]) {
        for (const command of commands) {
            if (!command.commandString && command instanceof TriggerableCommand) {
                this.addCommand("TriggerableCommand" + this.getCommandAmount("TriggerableCommand"), command);
            } else if (command.commandString) {
                this.addCommand(command.commandString, command);
            } else {
                //
            }
        }
    }

    private getCommandAmount(type?: string): number {
        let amount = 0;
        for (const pair of this.commands.entries()) {
            if (type) {
                if (typeof pair[1] === type) {
                    amount++;
                }
            } else {
                amount++;
            }
        }
        return amount;
    }

    public removeCommand(name: string): boolean {
        if (!this.commands.has(name)) {
            this.commands.delete(name);
            return true;
        }
        return false;
    }

    public disableCommand(name: string): boolean {
        if (!this.commands.has(name)) {
            this.commands.get(name).setEnabled(false);
            return true;
        }
        return false;
    }

    public enableCommand(name: string): boolean {
        if (!this.commands.has(name)) {
            this.commands.get(name).setEnabled(true);
            return true;
        }
        return false;
    }

    public commandExists(name: string): boolean {
        return this.commands.has(name);
    }

    public getCommandMap(): Map<string, Command> {
        return this.commands;
    }

    public getCommand(name: string): Command {
        return this.commands.get(name);
    }
}
