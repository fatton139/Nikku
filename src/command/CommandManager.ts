import * as Mongoose from "mongoose";
import * as winston from "winston";
import * as fs from "fs";
import Command from "command/Command";
import DBUserSchema from "database/schemas/DBUserSchema";
import PrefixManager from "command/PrefixManager";
import Logger from "log/Logger";
import NikkuCore from "core/NikkuCore";
import CommandRegistry from "./CommandRegistry";
import TriggerableCommand from "./TriggerableCommand";

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
    public constructor(core: NikkuCore) {
        this.logger.debug("Command Manager created.");
        this.core = core;
        this.prefixManager = new PrefixManager(core.getConfig().Command.PREFIXES);
        this.commandRegistry = new CommandRegistry();
    }

    public async loadCommands(commandPath: string, src: string, paths: string[]): Promise<void> {
        const importPaths: string[] = this.getImportPaths(commandPath, paths);
        this.logger.info(`Detected ${importPaths.length}` +
                ` ${importPaths.length === 1 ? "command" : "commands"} for import.`);
        for (const path of importPaths) {
            const commandClass = await import(`${src}/${path}`);
            if (!commandClass.default) {
                this.logger.warn(`Fail to register command. "${src}/${path}" has no default export.`);
                break;
            } else if (!(new commandClass.default() instanceof Command)) {
                this.logger.warn(`Fail to register command. "${src}/${path}" exported class is not of type "Command".`);
                break;
            } else {
                this.commandRegistry.addCommand(new commandClass.default());
            }
        }
        this.logger.info(`Successfully imported ${this.commandRegistry.getCommandSize()} ` +
                `out of ${importPaths.length} ${importPaths.length === 1 ? "command" : "commands"}.`);
    }

    private getImportPaths(commandPath: string, paths: string[]): string[] {
        const filePaths: string[] = [];
        for (const path of paths) {
            let files: string[];
            try {
                files = fs.readdirSync(`${commandPath}/${path}`);
            } catch (error) {
                if (error.code === "ENOENT") {
                    this.logger.warn(`No such directory "${path}".`);
                } else {
                    this.logger.warn(`FS System Error while reading "${path}".`);
                }
                break;
            }
            if (files.length === 0) {
                this.logger.verbose(`Empty command directory "${path}".`);
                break;
            }
            for (const file of files) {
                const fileName = file.split(".")[0];
                if (filePaths.indexOf(`${path}/${fileName}`) === -1) {
                    filePaths.push(`${path}/${fileName}`);
                    this.logger.info(`Command path detected "${path}/${fileName}".`);
                }
            }
        }
        return filePaths;
    }

    /**
     * Listens for channel messages and attempts to run a command by invoking its action or trigger.
     * @param line - The channel message to evaluate.
     * @param id - The discord id of the user invoking the command.
     */
    public parseLine(line: string, id: string): void {
        for (const prefix of this.prefixManager.getPrefixes()) {
            if (line.split(" ")[0] === prefix) {
                const commandString = this.extractCommand(line);
                if (commandString === null) {
                    return;
                }
                const command: Command = this.commandRegistry.getCommand(commandString);
                if (command) {
                    this.attemptExecution(command, this.extractArguments(line, command.getArgLength()), id).catch((err) => {
                        this.logger.verbose(
                            `${err.constructor.name}:Execution of "${command.getCommandString()}" failed`,
                        );
                    });
                }
                return;
            }
        }
        this.triggerAction(id);
    }

    private async attemptExecution(command: Command, args: string[], userId: string): Promise<void> {
        if (!this.core.getDbCore().isReady()) {
            this.logger.warn("Please wait until database connection has resolved.");
            return;
        }
        command.setArgs(args);
        const users: Mongoose.Model<Mongoose.Document, {}> = this.core.getDbCore().getUserModel();
        const user = await users.findOne({id: userId});
        if (user) {
            this.logger.info(`Executing command "${command.getCommandString()}".`);
            try {
                await command.executeAction(this.core, user as any as DBUserSchema);
            } catch (err) {
                throw err;
            }
        } else {
            this.logger.info(`Executing command "${command.getCommandString()}". NO_REG_USER.`);
            try {
                command.executeActionNoUser(this.core);
            } catch (err) {
                throw err;
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
    public triggerAction(userId: string): void {
        const users: Mongoose.Model<Mongoose.Document, {}> = this.core.getDbCore().getUserModel();
        for (const pair of this.commandRegistry.getCommandMap().entries()) {
            if (pair[1] instanceof TriggerableCommand) {
                const command: TriggerableCommand = pair[1] as TriggerableCommand;
                command.tryTrigger(this.core).then((status: boolean) => {
                    if (status) {
                        users.findOne({id: userId}).then((user: Mongoose.Document) => {
                            if (user) {
                                this.logger.info(`Triggering auto command "${command.constructor.name}". NO_WARN.`);
                                command.executeActionNoWarning(this.core, user as any as DBUserSchema);
                            } else {
                                this.logger.info(`Triggering auto command "${command.constructor.name}". NO_REG_USER.`);
                                try {
                                    command.executeActionNoUser(this.core);
                                } catch (err) {
                                    this.logger.verbose(
                                        `Auto execution of "${command.constructor.name}"` +
                                        `failed, ${err.constructor.name}.`,
                                    );
                                }
                            }
                        });
                    }
                });
            }
        }
    }

    public getCommandRegistry(): CommandRegistry {
        return this.commandRegistry;
    }
}
