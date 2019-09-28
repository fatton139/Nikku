import * as path from "path";

import { TriggerableCommand, ExecutableCommand, AbstractCommand as Command } from "../command";
import { CommandRegistry } from "../registries";
import { OnMessageState } from "../state";
import { NikkuException } from "../exception";
// import { AccessLevel } from "../user";
// import { NikkuCore } from "../core";

import { ImportManager } from "./ImportManager";
import { PrefixManager } from "./PrefixManager";
// import DBUserSchema from "../database/schemas/DBUserSchema";

export class CommandManager extends ImportManager {

    private prefixManager: PrefixManager;

    private commandRegistry: CommandRegistry;

    /**
     * @classdesc Class to handle import and execution of commands.
     */
    public constructor() {
        super();
        this.prefixManager = new PrefixManager();
        this.commandRegistry = new CommandRegistry();
    }

    private addCommandsToRegistry(entries: [string, Command][], importPath: string): void {
        let imported: number = 0;
        for (const [name, commandClass] of entries) {
            const CommandClass: any = commandClass;
            if (!CommandClass.constructor) {
                this.logger.warn(
                    `Fail to register command. "${importPath}"` +
                    ` exported class "${name}" has no constructor.`,
                );
                continue;
            }
            const command: Command = new CommandClass();
            if (!(command instanceof Command)) {
                this.logger.warn(
                    `Fail to register command. "${importPath}"` +
                    ` exported class "${name}" is not of type ${Command.name}.`,
                );
                continue;
            }
            this.commandRegistry.addCommand(command);
            imported++;
        }
        this.logger.info(`Imported ${imported} out of ${entries.length} command(s).`);
    }

    private async importCommands(importPath: string): Promise<void> {
        try {
            const commands: object = await import(importPath);
            const entries: [string, Command][] = Object.entries(commands);
            this.logger.info(`Detected ${entries.length} command(s) for import.`);
            this.addCommandsToRegistry(entries, importPath);
        } catch (e) {
            if (e instanceof Error) {
                throw e;
            }
        }
    }

    public async loadCommands(): Promise<void> {
        try {
            const importPaths: string[] = await this.getImportPaths();
            if (importPaths.length === 0) {
                this.logger.info(`No command import paths detected.`);
                return;
            }
            for (const importPath of importPaths) {
                await this.importCommands(path.resolve(importPath));
            }
        } catch (error) {
            this.logger.error(`Error while generating import paths. ${error.message}`);
        }
    }

    /**
     * Listens for channel messages and attempts to run a command by invoking its action or trigger.
     * @param line - The channel message to evaluate.
     * @param id - The discord id of the user invoking the command.
     */
    public parseLine(line: string, state: OnMessageState): void {
        let args: string[] = [];
        for (const prefix of this.prefixManager.getPrefixes()) {
            if (line.split(" ")[0] === prefix) {
                const commandString = this.extractCommand(line);
                if (!commandString) {
                    return;
                }
                const command: Command | undefined = this.commandRegistry.getElementByKey(commandString);
                if (command) {
                    args = this.extractArguments(line, command.getArgLength());
                    this.attemptExecution(
                        command, args, state,
                    ).catch((err: Error) => {
                        if (command instanceof ExecutableCommand) {
                            this.logger.verbose(
                                `${err.constructor.name}:Execution of "${command.getCommandString()}" failed.`,
                            );
                        }
                        this.logger.verbose(`${err.message}`);
                    });
                }
                return;
            }
        }
        this.triggerAction(state, args);
    }

    private async attemptExecution(
        command: Command, args: string[], state: OnMessageState,
    ): Promise<void> {
        if (command.getArgLength() !== 0 && args.length !== command.getArgLength()) {
            if (command instanceof ExecutableCommand) {
                command.displayUsageText(state);
                throw new NikkuException("Invalid arguments.");
            }
        }
        command.setArgs(args);
        if (command instanceof ExecutableCommand) {
            this.logger.info(`Executing command "${command.getCommandString()}"`);
        }
        try {
            command.executeAction(state);
        } catch (err) {
            throw err;
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
    public async triggerAction(state: OnMessageState, args: string[]): Promise<void> {
        for (const [name, command] of this.commandRegistry.getRegistry().entries()) {
            if (command instanceof TriggerableCommand) {
                if (await command.triggerConditionMet(state, args)) {
                    try {
                        this.logger.info(`Triggering auto command "${command.constructor.name}"`);
                        command.executeAction(state);
                    } catch (err) {
                        this.logger.verbose(`Auto execution of "${command.constructor.name}"` +
                            `failed, ${err.constructor.name}.`);
                    }
                }
            }
        }
    }

    public getCommandRegistry(): CommandRegistry {
        return this.commandRegistry;
    }

    public getPrefixManager(): PrefixManager {
        return this.prefixManager;
    }

}
