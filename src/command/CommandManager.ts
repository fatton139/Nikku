import * as winston from "winston";
import { Command } from "command/Command";
import { User } from "user/User";
import { FortniteBotException } from "exceptions/FortniteBotException";
import { PrefixManager } from "command/PrefixManager";
import { Logger } from "logger/Logger";
import { core } from "core/NikkuCore";
import { CommandRegistry } from "./CommandRegistry";
import TriggerableCommand from "./TriggerableCommand";
import { MrFortniteCommand } from "command/modules/DefaultCommands";

export class CommandManager {
    /**
     * Set of all commands.
     */
    // public commands: Command[];

    /**
     * The prefix required to begin calling a command.
     */
    private prefixManager: PrefixManager;

    private commandRegistry: CommandRegistry;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    /**
     * @classdesc Class to handle import and execution of commands.
     */
    public constructor(prefixes: string[]) {
        this.logger.debug("Command Manager created.");
        this.prefixManager = new PrefixManager(prefixes);
        this.commandRegistry = new CommandRegistry();
        this.loadCommands();
    }

    private loadCommands(): void {
        this.commandRegistry.addCommandMulti(MrFortniteCommand.commands);
    }

    /**
     * Listens for channel messages and attempts to run a command by invoking its action or trigger.
     * @param line - The channel message to evaluate.
     * @param id - The discord id of the user invoking the command.
     */
    public parseLine(line: string, id: string): void {
        this.triggerAction(id);
        const commandString = this.extractCommand(line);
        if (commandString === null) {
            return;
        }
        for (const prefix of this.prefixManager.getPrefixes()) {
            if (line.startsWith(prefix)) {
                const command = this.commandRegistry.getCommand(commandString);
                if (command) {
                    this.attemptExecution(command, this.extractArguments(line, command.action.argLength), id);
                }
                break;
            }
        }
    }

    public attemptExecution(command: Command, args: string[], id: string) {
        try {
            command.args = args;
            // core.getDbCore().collections.user
            // .get((res) => {
            //     const index = res.findIndex(
            //         (user) => user.id === id);
            //     if (index === -1) {
            //         command.executeAction(new User(undefined, 0));
            //     } else {
            //         command.executeAction(
            //             new User(res[index].id,
            //                 res[index].accessLevel,
            //             ));
            //     }
            // });
        } catch (e) {
            if (e instanceof FortniteBotException) {
                // Output
                return;
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
        for (const pair of this.commandRegistry.getCommandMap().entries()) {
            if (pair[1] instanceof TriggerableCommand) {
                const command: TriggerableCommand = pair[1];
                if (command.tryTrigger()) {
                    try {
                        command.executeAction(new User(undefined, 0));
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

    public getCommandRegistry(): CommandRegistry {
        return this.commandRegistry;
    }
}
