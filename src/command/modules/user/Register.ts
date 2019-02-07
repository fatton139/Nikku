import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";

export default class Register extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "register",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Register yourself.",
        });
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const user = state.getHandle().author;
            try {
                const doc = await DBUserSchema.getUserById(user.id);
                if (!doc) {
                    await DBUserSchema.createNewUser(user.id);
                    state.getHandle().reply(
                        "Successfully registered!" +
                        " You now have access to **Level 1** Commands",
                    );
                    return true;
                } else {
                    state.getHandle().reply("You are already registered.");
                    return true;
                }
            } catch (err) {
                state.getHandle().reply("Failed to register.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
