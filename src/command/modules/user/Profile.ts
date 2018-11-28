import ExecutableCommand from "command/ExecutableCommand";
import AccessLevel from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";

export default class Profile extends ExecutableCommand {
    public constructor() {
        super("profile", AccessLevel.REGISTERED, 0, "View your profile.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const user = state.getMessageHandle().author;
            try {
                const doc = await state.getDbCore().getUserModel().findOne({id: user.id});
                const dbUser = doc as any as DBUserSchema;
                const dateDiff = (new Date() as any) - (dbUser.dateRegistered as any);
                const hours = dateDiff / (1000 * 60 * 60);
                state.getMessageHandle().reply(
                    `\`\`\`` +
                    `${user.username} - ${dbUser.title.all[dbUser.title.active]}\n` +
                    `Access Level: ${dbUser.accessLevel} (${AccessLevel[dbUser.accessLevel]})\n` +
                    `Wallet:\n` +
                    `   DotmaCoins: ${dbUser.currency.dotmaCoin}\n` +
                    `   BradCoins: ${dbUser.currency.bradCoin}\n` +
                    `\n` +
                    `You have been registered for ${Math.round(hours)} hour(s).` +
                    `\`\`\``,
                );
                return true;
            } catch (err) {
                state.getMessageHandle().reply("Could not retrieve user data.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
