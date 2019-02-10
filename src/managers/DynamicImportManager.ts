import AbstractManager from "./AbstractManager";
import * as path from "path";
import * as fs from "fs";

export default class DynamicImportManager extends AbstractManager {

    protected readonly FULL_PATH: string;

    protected readonly DIR_PATH: string;

    protected readonly MODULE_PATHS: string[];

    public constructor(dirPath: string, modulePaths: string[]) {
        super();
        this.FULL_PATH = `${path.dirname(require.main.filename)}/src/${dirPath}`;
        this.DIR_PATH = dirPath;
        this.MODULE_PATHS = modulePaths;
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
