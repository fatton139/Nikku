import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";

export default class Unregister extends ExecutableCommand {
    public constructor() {
        super("unregister", AccessLevel.UNREGISTERED, 0, "Unregister yourself.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const user = state.getMessageHandle().author;
            try {
                // Check user does currently exist
                const doc = await DBUserSchema.getUserById(user.id);
                if (doc) {
                    // User does exist
                    const stat = await DBUserSchema.removeUser(user.id);
                    if (stat) {
                        return true;
                    }
                } else {
                    state.getMessageHandle().reply("You are not currently regeristered.");
                    return true;
                }
            } catch (err) {
                state.getMessageHandle().reply("Failed to unregister.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
