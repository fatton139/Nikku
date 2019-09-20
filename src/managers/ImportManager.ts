import * as path from "path";
import * as fs from "fs";
import * as util from "util";

import { AbstractManager } from "./";

const readdir = util.promisify(fs.readdir);

export class ImportManager extends AbstractManager {

    protected readonly FULL_PATH?: string;

    protected readonly DIR_PATH: string;

    protected readonly MODULE_PATHS: string[];

    public constructor(modulePaths?: string[], dirPath?: string) {
        super();
        this.FULL_PATH = require.main ? `${path.dirname(require.main.filename)}/src/${dirPath}` : undefined;
        this.DIR_PATH = dirPath ? dirPath : "";
        this.MODULE_PATHS = modulePaths ? modulePaths : (this.botConfig.MODULE_PATHS || []);
    }

    public addImportPath(path: string): void {
        if (this.MODULE_PATHS.indexOf(path) === -1) {
            this.MODULE_PATHS.push(path);
        } else {
            throw new Error(`Duplicate path '${path}'.`);
        }
    }

    protected async getImportPaths(): Promise<string[]> {
        const filePaths: string[] = [];
        for (const modulePath of this.MODULE_PATHS) {
            try {
                const files: string[] = await readdir(`${this.FULL_PATH}/${modulePath}`);
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
            } catch (error) {
                if (error.code === "ENOENT") {
                    this.logger.warn(`No such directory "${this.FULL_PATH}/${modulePath}".`);
                } else {
                    this.logger.warn(`FS error while reading "${modulePath}".`);
                    break;
                }
                if (error instanceof Error) {
                    throw error;
                }
            }
        }
        return filePaths;
    }
}
