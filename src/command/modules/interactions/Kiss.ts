import { AccessLevel } from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";

/**
 * Allows a user to kiss another user :)
 * returns boolean indicating success of command.
 */
export default class Kiss extends ExecutableCommand {
    public constructor() {
        super("kiss", AccessLevel.REGISTERED, 1, "Attempt to kiss someone.", "!f kiss [target]");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            try {
                const userModel = DBUserSchema.getModel();
                const userId = state.getMessageHandle().author.id;
                if (state.getMessageHandle().mentions.everyone)  {
                    state.getMessageHandle().channel.send("You cannot kiss everyone at once OwO.");
                    return false;
                }
                const targetId = state.getMessageHandle().mentions.users.first().id;
                if (userId === targetId) {
                    state.getMessageHandle().channel.send("You cannot kiss yourself silly xD.");
                    return false;
                }
                const dbUser = await userModel.getUserById(userId);
                const dbTarget = await userModel.getUserById(targetId);
                if (!dbTarget) {
                    state.getMessageHandle().channel.send("Kissing Target is not registered ♥!.");
                    return false;
                }
                state.getMessageHandle().channel.send(`<@!${userId}> ( ˘ ³˘)♥  <@!${targetId}> `);
                return true;
            } catch (err) {
                this.logger.warn(err);
                return false;
            }
        });
    }
}
