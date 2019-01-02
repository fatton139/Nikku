import AccessLevel from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import randInt from "utils/Random";
import DBUserSchema from "database/schemas/DBUserSchema";
import CoinType from "user/CoinType";
import { isNullOrUndefined } from "util";

export default class Test extends ExecutableCommand {
    public constructor() {
        super("thieve", AccessLevel.UNREGISTERED, 0, "Test to thieve");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState, args: string[]) => {
            const user = state.getMessageHandle().author;
            if (state.getMessageHandle().mentions.everyone === true)  {
                state.getMessageHandle().channel.send("You cant thieve everyone at once. Correct usage !f thieve @target");
                return true ;
            }
            if (args.length === 0) {
                state.getMessageHandle().channel.send("Correct usage !f thieve @target");
                return true;
            }
            const target = state.getMessageHandle().mentions.users.first().id;
            if (user.id === target) {
                state.getMessageHandle().channel.send("You cannot thieve yourself.");
                return true;
            }
            const doc = await state.getDbCore().getUserModel().findOne({id: user.id});
            const targetdoc = await state.getDbCore().getUserModel().findOne({id: target});
            const dbUser = doc as any as DBUserSchema;
            if (!doc) {
                state.getMessageHandle().channel.send("You are not registered. type !f register to register.");
                return true;
            }
            const dbTarget = targetdoc as any as DBUserSchema;
            if (!targetdoc) {
                state.getMessageHandle().channel.send("Target is not registered.");
                return true;
            }
            const thievedifference = (dbTarget.skills.thievelevel - dbUser.skills.thievelevel);
            let targetchance = 55 - thievedifference;
            if (targetchance < 5) {
                targetchance = 5;
            }
            if (targetchance < 95) {
                targetchance = 95;
            }
            if (randInt(0, 100) < targetchance) {
                let coinsthieved = 15 + (dbUser.skills.thievelevel) + thievedifference;
                let xpgained = (dbUser.skills.thievelevel * 10) + thievedifference;
                if (coinsthieved < 5) {
                    coinsthieved = 5;
                }
                if (xpgained < 30) {
                    xpgained = 30;
                }
                state.getMessageHandle().channel.send("Successfully thieved " + coinsthieved
                + " coins from <@!"
                + target + "> and gained " + xpgained + " experience");
                await dbUser.addCurrency(CoinType.DOTMA_COIN, coinsthieved);
                await dbUser.addXp(xpgained);
                await dbTarget.removeCurrency(CoinType.DOTMA_COIN, coinsthieved);
            } else {
                state.getMessageHandle().channel.send("Target successfully defended your thieve attempt.");
            }
            return true;
        });
    }
}
