import * as winston from "winston";

import { Logger } from "../log";
import { NikkuCore } from "../core";
import { ImportManager } from "../managers";

export class CommandImporter {
    private readonly logger: winston.Logger = Logger.getNamedLogger(this.constructor);

    private readonly importManager: ImportManager;

    public constructor() {
        this.importManager = NikkuCore.getCoreInstance().getManager(ImportManager);
    }

    public registerPath(path: string): void {
        try {
            this.importManager.addImportPath(path);
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
