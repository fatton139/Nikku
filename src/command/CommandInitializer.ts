import { AccessLevel } from "../user";

export interface CommandInitializer {
    readonly accessLevel: AccessLevel;
    readonly argLength: number;
    readonly description?: string;
}

export interface ExecutableCommandInitializer extends CommandInitializer {
    readonly commandString: string;
    readonly usage?: string;
}