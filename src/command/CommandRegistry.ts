import * as winston from "winston";
import Command from "./Command";
import TriggerableCommand from "./TriggerableCommand";
import Logger from "log/Logger";
import ExecutableCommand from "./ExecutableCommand";

export default class CommandRegistry {
    private commands: Map<string, Command>;
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    public constructor() {
        this.logger.debug("Command Registry created.");
        this.commands = new Map<string, Command>();
    }

    public addCommand(command: Command): boolean {
        const name: string = command.getCommandString();
        if (command instanceof TriggerableCommand) {
            if (this.commands.has(command.constructor.name)) {
                this.logger.warn(`Duplicate command "${command.constructor.name}".`);
                return false;
            }
            this.commands.set(command.constructor.name, command);
            this.logger.info(
                `AutoCommand registered` +
                ` "${command.constructor.name}".`,
            );
            return true;
        } else if (name && name.length !== 0) {
            if (this.commands.has(name)) {
                this.logger.warn(`Duplicate command "${name}".`);
                return false;
            }
            this.commands.set(name, command);
            this.logger.info(`ExecutableCommand registered "${name}".`);
            return true;
        }
        return false;
    }

    public addCommandMulti(commands: Command[]): boolean {
        for (const command of commands) {
            if (!this.addCommand(command)) {
                this.logger.warn(`Failed to register command "${command.getCommandString()}".`);
                return false;
            }
        }
        return true;
    }

    private getAutoCommandAmount(): number {
        let amount = 0;
        for (const command of this.commands.values()) {
            if (command instanceof TriggerableCommand) {
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

    public getCommandSize(): number {
        return this.commands.size;
    }
}
