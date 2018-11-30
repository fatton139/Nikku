import AccessLevel from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import randInt from "utils/Random";
import DBUserSchema from "database/schemas/DBUserSchema";
import CoinType from "user/CoinType";

export default class Test extends ExecutableCommand {
    public constructor() {
        super("thieve", AccessLevel.UNREGISTERED, 0, "Test to yoink");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const user = state.getMessageHandle().author;
            if (randInt(0, 100) < 50) {
                const doc = await state.getDbCore().getUserModel().findOne({id: user.id});
                const dbUser = doc as any as DBUserSchema;
                state.getMessageHandle().channel.send("yoinked cx");
                await dbUser.addCurrency(CoinType.DOTMA_COIN, 100);
                await dbUser.addXp(100);
            } else {
                state.getMessageHandle().channel.send("no yoink cx");
            }
            return true;
        });
    }
}
