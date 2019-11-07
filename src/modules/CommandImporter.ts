import * as winston from "winston";

import { Logger } from "../log";
import { NikkuCore } from "../core";
import { CommandManager } from "../managers";

export class CommandImporter {
    private readonly logger: winston.Logger = Logger.getNamedLogger(this.constructor);

    private readonly commandManager: CommandManager;

    public constructor() {
        this.commandManager = NikkuCore.getCoreInstance().getManager(CommandManager);
    }

    public registerPath(path: string): void {
        try {
            this.commandManager.addImportPath(path);
        } catch (e) {
            this.logger.warn(e.message);
        }
    }

    public registerPathAndLoad(path: string): void {
        try {
            this.registerPath(path);
            this.commandManager.loadCommands();
        } catch (e) {
            this.logger.warn(e.message);
        }
    }

    public registerPaths(paths: string[]): void {
        for (const path of paths) {
            this.registerPath(path);
        }
    }
}
