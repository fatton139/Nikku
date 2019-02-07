import AbstractCommand from "command/AbstractCommand";
import TriggerableCommand from "command/TriggerableCommand";
import BaseRegistry from "./BaseRegistry";

export default class CommandRegistry extends BaseRegistry<AbstractCommand> {
    public constructor() {
        super();
    }

    public addCommand(command: AbstractCommand): boolean {
        const name: string = command.getCommandString();
        if (command instanceof TriggerableCommand) {
            if (this.registry.has(command.constructor.name)) {
                this.logger.warn(`Duplicate command "${command.constructor.name}".`);
                return false;
            }
            this.registry.set(command.constructor.name, command);
            this.logger.info(
                `AutoCommand registered` +
                ` "${command.constructor.name}".`,
            );
            return true;
        } else if (name && name.length !== 0) {
            if (this.registry.has(name)) {
                this.logger.warn(`Duplicate command "${name}".`);
                return false;
            }
            this.registry.set(name, command);
            this.logger.info(`ExecutableCommand registered "${name}".`);
            return true;
        }
        return false;
    }

    public addCommandMulti(commands: AbstractCommand[]): boolean {
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
        for (const command of this.registry.values()) {
            if (command instanceof TriggerableCommand) {
                amount++;
            }
        }
        return amount;
    }

    public removeCommand(name: string): boolean {
        if (!this.registry.has(name)) {
            this.registry.delete(name);
            return true;
        }
        return false;
    }

    public disableCommand(name: string): boolean {
        if (!this.registry.has(name)) {
            this.registry.get(name).setEnabled(false);
            return true;
        }
        return false;
    }

    public enableCommand(name: string): boolean {
        if (!this.registry.has(name)) {
            this.registry.get(name).setEnabled(true);
            return true;
        }
        return false;
    }
}
