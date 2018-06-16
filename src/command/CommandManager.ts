import { FortniteBotCommandConfig } from "../config/FortniteBotCommandConfig";
import { Command } from "../command/Command";
import { AutoTriggerCommand } from "./AutoTriggerCommand";
import { User } from "../user/User";
import { FortniteBotException } from "../exceptions/FortniteBotException";

export class CommandManager {
    public commands: Command[];
    private prefix: FortniteBotCommandConfig;
    public constructor(commands?: Command[]) {
        this.commands = commands;
        this.prefix = new FortniteBotCommandConfig(
            [
                "!f",
                "!fortnite"
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
        const commandString = this.extractCommand(line);
        if (commandString === null) {
            return;
        }
        for (const s of this.prefix.getPrefix()) {
            if (line.startsWith(s)) {
                for (const command of this.commands) {
                    if (commandString === command.commandString) {
                        try {
                            if (command.action.argLength > 0) {
                                let args = this.extractArguments(line,
                                    command.action.argLength);
                                if (args.length !== command.action.argLength) {
                                    args = [];
                                }
                                command.args = args;
                            }
                            command.executeAction(user);
                        } catch (e) {
                            if (e instanceof FortniteBotException) {
                                // Output
                                return;
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    public extractCommand(line: string): string {
        return line.split(" ")[1] ? line.split(" ")[1] : " ";
    }
    public extractArguments(line: string, amount: number): string[] {
        return line.split(" ").splice(2, amount);
    }
    public triggerAction(user: User): void {
        for (const command of this.commands) {
            if (command instanceof AutoTriggerCommand) {
                if (command.tryTrigger()) {
                    try {
                        command.executeAction(user);
                    } catch (e) {
                        if (e instanceof FortniteBotException) {
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
