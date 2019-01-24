import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class AddTargetSelf extends ExecutableCommand {
    public constructor() {
        super("targetself", AccessLevel.UNREGISTERED, 0, "Adds yourself to the target list.");
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
                    try {
                        await doc.addTarget(id);
                        state.getHandle().reply(`Added to target list.`);
                    } catch (err) {
                        state.getHandle().reply(`Failed to add to target list.`);
                        throw err;
                    }
                    return true;
                } else {
                    state.getHandle().reply(`You are already on the target list.`);
                }
            }
        });
    }
}
