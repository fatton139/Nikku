import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class UseOn extends ExecutableCommand {
    public constructor() {
        super("useon", AccessLevel.UNREGISTERED, 2, "Use item on another user.", "!f useon [itemName] [target]");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState, args: string[]): Promise<boolean> => {
            return true;
        });
    }
}
