import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";

export default class Register extends ExecutableCommand {
    public constructor() {
        super("register", AccessLevel.UNREGISTERED, 0, "Register yourself.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const user = state.getMessageHandle().author;
            try {
                const doc = await DBUserSchema.getUserById(user.id);
                if (!doc) {
                    const model = new DBUserSchema().getModelForClass(DBUserSchema);
                    await model.createNewUser(user.id);
                    state.getMessageHandle().reply(
                        "Successfully registered!" +
                        " You now have access to **Level 1** Commands",
                    );
                    return true;
                } else {
                    state.getMessageHandle().reply("You are already registered.");
                    return true;
                }
            } catch (err) {
                state.getMessageHandle().reply("Failed to register.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
