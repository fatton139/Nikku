import AccessLevel from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import randInt from "utils/Random";
import DBUserSchema from "database/schemas/DBUserSchema";
import CoinType from "user/CoinType";
import SkillType from "user/skill/SkillType";
import Skill from "user/skill/Skill";

export default class Pickpocket extends ExecutableCommand {
    public constructor() {
        super("pickpocket", AccessLevel.REGISTERED, 1, "Attempt to steal coins from someone.", "!f thieve [target]");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            try {
                const userModel = new DBUserSchema().getModelForClass(DBUserSchema);
                const userId = state.getMessageHandle().author.id;
                if (state.getMessageHandle().mentions.everyone)  {
                    state.getMessageHandle().channel.send("You cannot thieve everyone at once.");
                    return false;
                }
                const targetId = state.getMessageHandle().mentions.users.first().id;
                if (userId === targetId) {
                    state.getMessageHandle().channel.send("You cannot thieve yourself.");
                    return false;
                }
                const dbUser = await userModel.getUser(userId);
                const dbTarget = await userModel.getUser(targetId);
                if (!dbTarget) {
                    state.getMessageHandle().channel.send("Target is not registered.");
                    return false;
                }
                const levelDifference = (await dbTarget.getSkillLevel(SkillType.THIEVING)) -
                    (await dbUser.getSkillLevel(SkillType.THIEVING));
                let targetChance = 55 - levelDifference;
                targetChance = targetChance < 5 ? 5 : targetChance;
                targetChance = targetChance > 95 ? 95 : targetChance;
                if (randInt(0, 100) < targetChance) {
                    let coinsStolen = 15 + (await dbUser.getSkillLevel(SkillType.THIEVING)) + levelDifference;
                    coinsStolen = coinsStolen < 5 ? 5 : coinsStolen;
                    let experienceGained = (await dbUser.getSkillLevel(SkillType.THIEVING) * 10) + levelDifference;
                    experienceGained = experienceGained < 30 ? 30 : experienceGained;
                    state.getMessageHandle().channel.send(`Successfully thieved ${coinsStolen} coins from <@!${targetId}>. `
                    + `Gained ${experienceGained} experience.`);
                    await dbUser.addSkillExperience(SkillType.THIEVING, experienceGained);
                    await dbUser.addCurrency(CoinType.DOTMA_COIN, coinsStolen);
                    await dbTarget.removeCurrency(CoinType.DOTMA_COIN, coinsStolen);
                } else {
                    state.getMessageHandle().channel.send("You failed to pickpocket.");
                }
                return true;
            } catch (err) {
                this.logger.warn(err);
                return false;
            }
        });
    }
}
