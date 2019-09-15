import * as path from "path";
import * as fs from "fs";

import { AbstractManager } from "./";

export class DynamicImportManager extends AbstractManager {

    protected readonly FULL_PATH?: string;

    protected readonly DIR_PATH: string;

    protected readonly MODULE_PATHS: string[];

    public constructor(modulePaths?: string[], dirPath?: string) {
        super();
        this.FULL_PATH = require.main ? `${path.dirname(require.main.filename)}/src/${dirPath}` : undefined;
        this.DIR_PATH = dirPath ? dirPath : "";
        this.MODULE_PATHS = modulePaths ? modulePaths : (this.botConfig.MODULE_PATHS || []);
    }

    protected getImportPaths(): string[] {
        const filePaths: string[] = [];
        for (const modulePath of this.MODULE_PATHS) {
            let files: string[];
            try {
                files = fs.readdirSync(`${this.FULL_PATH}/${modulePath}`);
                if (files.length === 0) {
                    this.logger.verbose(`Empty directory "${modulePath}".`);
                }
                for (const file of files) {
                    const fileName = file.split(".")[0];
                    if (filePaths.indexOf(`${modulePath}/${fileName}`) === -1) {
                        filePaths.push(`${modulePath}/${fileName}`);
                        this.logger.info(`Path detected "${modulePath}/${fileName}".`);
                    }
                }
            } catch (err) {
                if (err.code === "ENOENT") {
                    this.logger.warn(`No such directory "${modulePath}".`);
                } else {
                    this.logger.warn(`FS error while reading "${modulePath}".`);
                    break;
                }
                throw new Error(err);
            }
        }
        return filePaths;
    }
}
