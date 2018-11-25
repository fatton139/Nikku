import ExecutableCommand from "command/ExecutableCommand";
import AccessLevel from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class AddTargetSelf extends ExecutableCommand {
    public constructor() {
        super("targetself", AccessLevel.UNREGISTERED, 0, "Adds yourself to the target list");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const guildId = state.getMessageHandle().guild.id;
            const doc = await state.getDbCore().getGuildPropertyModel().findOne({id: guildId});
            if (!doc) {
                state.getMessageHandle().reply(`Hmmm, your guild is not in the database. Adding...`);
                await state.getDbCore().generateGuildPropertyModel();
                return false;
            } else {
                const guild = doc as any as DBGuildPropertySchema;
                const id: string = state.getMessageHandle().author.id;
                if (guild.targets.indexOf(id) === -1) {
                    guild.addTarget(id);
                    state.getMessageHandle().reply(`Added to target list.`);
                    return true;
                } else {
                    state.getMessageHandle().reply(`You are already on the target list.`);
                }
            }
            return false;
        });
    }
}
