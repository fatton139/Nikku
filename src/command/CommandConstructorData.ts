import { AccessLevel } from "user/AccessLevel";

export namespace CommandConstructorData {
    export interface Base {
        accessLevel: AccessLevel;
        argLength: number;
        description?: string;
    }
    export interface Executable extends Base {
        commandString: string;
        usage?: string;
    }
}
