import { Command } from "../command/Command";
import { AutoTriggerCommand } from "./AutoTriggerCommand";

export class CommandManager {
    public commands: Command[];
    public constructor(commands?: Command[]) {
        this.commands = commands;
    }
    public addCommand(command: Command) {
        if (!this.commandExists(command.commandString)) {
            this.commands.push(command);
        }
    }
    public addBulkCommand(commands: Command[]) {
        for (const command of commands) {
            this.addCommand(command);
        }
    }
    public executeCommand(commandName: string): void {
        for (const command of this.commands) {
            if (commandName === command.commandString) {
                command.executeAction();
            }
        }
    }
    public triggerCommand(): void {
        for (const command of this.commands) {
            if (command instanceof AutoTriggerCommand) {
                try {
                    command.tryTrigger();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
    private commandExists(name: string): boolean {
        for (const command of this.commands) {
            if (command.commandString === name) {
                return true;
            }
        }
        return false;
    }
}
