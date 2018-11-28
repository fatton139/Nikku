import ExecutableCommand from "command/ExecutableCommand";
import AccessLevel from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";
import CoinType from "user/CoinType";

export default class Daily extends ExecutableCommand {
    public constructor() {
        super("daily", AccessLevel.REGISTERED, 0, "Grab your daily coins.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const user = state.getMessageHandle().author;
            try {
                const doc = await state.getDbCore().getUserModel().findOne({id: user.id});
                const dbUser = doc as any as DBUserSchema;
                const dateDiff = (new Date() as any) - (dbUser.daily.lastUpdate as any);
                const hours = dateDiff / (1000 * 60 * 60);
                if (hours > 24) {
                    await dbUser.addCurrency(CoinType.DOTMA_COIN, 100);
                    await dbUser.setDaily();
                    state.getMessageHandle().reply("You got 100 **DotmaCoins**™©!");
                    return true;
                }
                const hourRem = Math.floor(24 - hours);
                const minRem = Math.floor(((24 - hours) - Math.floor(24 - hours)) * 60);
                state.getMessageHandle().reply(`Try again in **${hourRem} Hour(s) and ${minRem} Minute(s)**.`);
                return true;
            } catch (err) {
                state.getMessageHandle().reply("Failed to retrieve dailies status.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
