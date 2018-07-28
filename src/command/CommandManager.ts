import { FortniteBotCommandConfig } from "../config/FortniteBotCommandConfig";
import { Command } from "../command/Command";
import { AutoTriggerCommand } from "../command/AutoTriggerCommand";
import { User } from "../user/User";
import { FortniteBotException } from "../exceptions/FortniteBotException";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class CommandManager {
    /**
     * Set of all commands.
     */
    public commands: Command[];

    /**
     * The prefix required to begin calling a command.
     */
    private prefix: FortniteBotCommandConfig;

    /**
     * @classdesc Class to handle import and execution of commands.
     */
    public constructor() {
        this.commands = [];
        this.prefix = new FortniteBotCommandConfig(
            [
                "!f"
            ]
        );
    }

    /**
     * Loads a single command.
     * @param command - The command to load.
     */
    public addCommand(command: Command): void {
        if (!this.commandExists(command.commandString)) {
            this.commands.push(command);
        }
    }

    /**
     * Loads a array of commands.
     * @param commands - The set of commands to load.
     */
    public addBulkCommand(commands: Command[]): void {
        for (const command of commands) {
            this.addCommand(command);
        }
    }

    /**
     * Listens for channel messages and attempts to run a command by invoking its action or trigger.
     * @param line - The channel message to evaluate.
     * @param id - The discord id of the user invoking the command.
     */
    public attemptExecution(line: string, id: string): void {
        this.triggerAction(id);
        const commandString = this.extractCommand(line);
        if (commandString === null) {
            return;
        }
        for (const s of this.prefix.getPrefix()) {
            if (line.startsWith(s)) {
                for (const command of this.commands) {
                    if (commandString === command.commandString) {
                        try {
                            let args = this.extractArguments(line,
                                command.action.argLength);
                            if (args.length !== (line.split(" ").length - 2) &&
                                command.action.argLength !== 0) {
                                args = [];
                            }
                            command.args = args;
                            activeCore.getDbCore().collections.user
                            .get((res) => {
                                const index = res.findIndex(
                                    (user) => user.id === id);
                                if (index === -1) {
                                    command.executeAction(new User(null, 0));
                                } else {
                                    command.executeAction(
                                        new User(res[index].id,
                                            res[index].accessLevel
                                        ));
                                }
                            });

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

    /**
     * Extracts the command name from a message.
     * @param line - The channel message to evaluate.
     * @returns The command string for a command.
     */
    public extractCommand(line: string): string {
        return line.split(" ")[1] ? line.split(" ")[1] : " ";
    }

    /**
     * Extracts the arguments provided for a command.
     * @param line - line - The channel message to evaluate.
     * @param amount - The amount of arguments to extract.
     * @returns A array of arguments for the command.
     */
    public extractArguments(line: string, amount: number): string[] {
        return amount === 0 ?
            line.split(" ").splice(2, line.split(" ").length) :
            line.split(" ").splice(2, amount);
    }

    /**
     * Attempt to invoke the action by testing if the trigger conditions are met.
     * @param id - The discord id of the user invoking the command.
     */
    public triggerAction(id: string): void {
        for (const command of this.commands) {
            if (command instanceof AutoTriggerCommand) {
                if (command.tryTrigger()) {
                    try {
                        command.executeAction(new User(null, 0));
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

    /**
     * Checks if a command has already been loaded.
     * @param name - The name of the command.
     * @returns true if commands exists, false otherwise.
     */
    private commandExists(name: string): boolean {
        if (!name) {
            return false;
        }
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
