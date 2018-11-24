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
        return new Action(async (state: OnMessageState, args) => {
            const guildId = state.getMessageHandle().guild.id;
            const doc = await state.getDbCore().getGuildPropertyModel().findOne({id: guildId});
            if (!doc) {
                await state.getDbCore().generateGuildPropertyModel();
                return false;
            } else {
                const guild = doc as any as DBGuildPropertySchema;
                state.getMessageHandle().channel.send(`${guild.targets}`);
                const id: string = state.getMessageHandle().author.id;
                if (guild.targets.indexOf(id) === -1) {
                    guild.addTarget(id);
                    state.getMessageHandle().channel.send(`Added to target list.`);
                    return true;
                }
            }
            return false;
        });
    }
}
