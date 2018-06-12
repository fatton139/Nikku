import { FortnightBotCommandConfig } from "../config/FortnightBotCommandConfig";
import { Command } from "../command/Command";
import { AutoTriggerCommand } from "./AutoTriggerCommand";
import { User } from "../user/User";
import { FortnightBotException } from "../exceptions/FortnightBotException";

export class CommandManager {
    public commands: Command[];
    private prefix: FortnightBotCommandConfig;
    public constructor(commands?: Command[]) {
        this.commands = commands;
        this.prefix = new FortnightBotCommandConfig(
            [
                "!f",
                "!fortnight"
            ]
        );
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
    public attemptExecution(line: string, user: User): void {
        this.triggerAction(user);
        for (const s of this.prefix.getPrefix()) {
            if (line.startsWith(s)) {
                this.executeCommand(this.extractCommand(line), user);
                break;
            }
        }
    }
    public executeCommand(commandName: string, user: User): void {
        for (const command of this.commands) {
            if (commandName === command.commandString) {
                try {
                    command.executeAction(user);
                } catch (e) {
                    if (e instanceof FortnightBotException) {
                        // Output
                        return;
                    }
                }
            }
        }
    }
    public triggerAction(user: User): void {
        for (const command of this.commands) {
            if (command instanceof AutoTriggerCommand) {
                if (command.tryTrigger()) {
                    try {
                        command.executeAction(user);
                    } catch (e) {
                        if (e instanceof FortnightBotException) {
                            // Output
                            return;
                        }
                    }
                }
            }
        }
    }
    private commandExists(name: string): boolean {
        if (Object.keys(this.commands).length > 1) {
            for (const command of this.commands) {
                if (command.commandString === name) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
}
