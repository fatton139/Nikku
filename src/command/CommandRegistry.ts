import * as winston from "winston";
import { Command } from "./Command";
import TriggerableCommand from "./TriggerableCommand";
import { Logger } from "logger/Logger";

export class CommandRegistry {
    private commands: Map<string, Command>;
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    public constructor() {
        this.logger.debug("Command Registry created.");
        this.commands = new Map<string, Command>();
    }

    public addCommand(command: Command): boolean {
        const name: string = command.getCommandString();
        if (command instanceof TriggerableCommand) {
            const index = this.getCommandAmount("TriggerableCommand");
            this.commands.set("TriggerableCommand" + index, command);
            this.logger.info(
                `AutoCommand registered` +
                `"${"TriggerableCommand" + index}".`,
            );
            return true;
        } else if (!this.commands.has(name) && name && name.length !== 0) {
            this.commands.set(name, command);
            this.logger.info(`Command registered "${name}".`);
            return true;
        }
        return false;
    }

    public addCommandMulti(commands: Command[]) {
        for (const command of commands) {
            if (!this.addCommand(command)) {
                this.logger.warn(`Failed to register command "${command.getCommandString()}".`);
            }
        }
    }

    private getCommandAmount(type?: string): number {
        let amount = 0;
        for (const pair of this.commands.entries()) {
            if (type) {
                if (pair[1].constructor.name === type) {
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
