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
            const guild = state.getHandle().guild;
            const doc = await DBGuildPropertySchema.getGuildById(guild.id);
            if (!doc) {
                state.getHandle().reply(`Cannot use this command,`
                        + ` this guild is not registered. Register with \`!f registerguild\`.`);
            } else {
                const id: string = state.getHandle().author.id;
                if (doc.targets.indexOf(id) === -1) {
                    state.getHandle().reply("You are not on the target list.");
                    return true;
                }
                try {
                    await doc.removeTarget(id);
                    state.getHandle().reply("Successfully removed from the target list");
                    return true;
                } catch (err) {
                    state.getHandle().reply("Failed to remove from target list.");
                    throw err;
                }
            }
        });
    }
}
