import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class RemoveTargetSelf extends ExecutableCommand {
    public constructor() {
        super("removeself", AccessLevel.UNREGISTERED, 0, "Removes yourself from the target list.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
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
                    state.getMessageHandle().reply("You are not on the target list.");
                    return true;
                }
                try {
                    await guild.removeTarget(id);
                    state.getMessageHandle().reply("Successfully removed from the target list");
                    return true;
                } catch (err) {
                    state.getMessageHandle().reply("Failed to remove from target list.");
                    throw err;
                }
            }
        });
    }
}
