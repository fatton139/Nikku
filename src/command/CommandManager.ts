import * as Mongoose from "mongoose";
import * as winston from "winston";
import Command from "command/Command";
import DBUserSchema from "database/schemas/DBUserSchema";
import NikkuException from "exception/NikkuException";
import PrefixManager from "command/PrefixManager";
import Logger from "logger/Logger";
import NikkuCore from "core/NikkuCore";
import CommandRegistry from "./CommandRegistry";
import TriggerableCommand from "./TriggerableCommand";
import MrFortniteCommands from "command/modules/MrFortniteCommands";

export default class CommandManager {
    /**
     * The prefix required to begin calling a command.
     */
    private prefixManager: PrefixManager;

    private commandRegistry: CommandRegistry;

    private core: NikkuCore;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    /**
     * @classdesc Class to handle import and execution of commands.
     */
    public constructor(core: NikkuCore, prefixes: string[]) {
        this.logger.debug("Command Manager created.");
        this.core = core;
        this.prefixManager = new PrefixManager(prefixes);
        this.commandRegistry = new CommandRegistry();
        this.loadCommands();
    }

    private loadCommands(): void {
        this.commandRegistry.addCommandMulti(MrFortniteCommands.commands);
    }

    /**
     * Listens for channel messages and attempts to run a command by invoking its action or trigger.
     * @param line - The channel message to evaluate.
     * @param id - The discord id of the user invoking the command.
     */
    public parseLine(line: string, id: string): void {
        for (const prefix of this.prefixManager.getPrefixes()) {
            if (line.startsWith(prefix)) {
                const commandString = this.extractCommand(line);
                if (commandString === null) {
                    return;
                }
                const command = this.commandRegistry.getCommand(commandString);
                if (command) {
                    this.attemptExecution(command, this.extractArguments(line, command.getArgLength()), id);
                }
                return;
            }
        }
        this.triggerAction(id);
    }

    private attemptExecution(command: Command, args: string[], userId: string) {
        command.setArgs(args);
        const users: Mongoose.Model<Mongoose.Document, {}> = this.core.getDbCore().getUserModel();
        users.findOne({id: userId}).then((user: Mongoose.Document) => {
            if (user) {
                this.logger.info(`Executing command "${command.getCommandString()}".`);
                command.executeAction(this.core, user as any as DBUserSchema).catch((err: NikkuException) => {
                    this.logger.verbose(
                        `Execution of "${command.getCommandString()}"` +
                        `failed, ${err.constructor.name}.`,
                    );
                });
            } else {
                this.logger.info(`Executing command "${command.getCommandString()}" with no registered user.`);
                command.executeActionNoUser(this.core).catch((err: NikkuException) => {
                    this.logger.verbose(
                        `Execution of "${command.getCommandString()}"` +
                        `failed, ${err.constructor.name}.`,
                    );
                });
            }
        });
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
    public triggerAction(userId: string): void {
        const users: Mongoose.Model<Mongoose.Document, {}> = this.core.getDbCore().getUserModel();
        for (const pair of this.commandRegistry.getCommandMap().entries()) {
            if (pair[1] instanceof TriggerableCommand) {
                const command: TriggerableCommand = pair[1];
                if (command.tryTrigger(this.core)) {
                    users.findOne({id: userId}).then((user: Mongoose.Document) => {
                        if (user) {
                            this.logger.info(`Triggering auto command with no warning.`);
                            command.executeActionNoWarning(this.core, user as any as DBUserSchema);
                        } else {
                            this.logger.info(`Triggering auto command with no registered user.`);
                            command.executeActionNoUser(this.core).catch((err: NikkuException) => {
                                this.logger.verbose(
                                    `Auto execution of "${command.getCommandString()}"` +
                                    `failed, ${err.constructor.name}.`,
                                );
                            });
                        }
                    });
                }
            }
        }
    }

    public getCommandRegistry(): CommandRegistry {
        return this.commandRegistry;
    }
}
