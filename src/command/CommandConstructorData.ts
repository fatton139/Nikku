import { AccessLevel } from "user/AccessLevel";

export namespace CommandConstructorData {
    export interface IBase {
        accessLevel: AccessLevel;
        argLength: number;
        description?: string;
    }
    export interface IExecutable extends IBase {
        commandString: string;
        usage?: string;
    }
}
