import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class TargetList extends ExecutableCommand {
    public constructor() {
        super("targetlist", AccessLevel.UNREGISTERED, 0, "Retrieves the current targets.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const guild = state.getMessageHandle().guild;
            const doc = await state.getDbCore().getGuildPropertyModel().findOne({id: guild.id});
            if (!doc) {
                state.getMessageHandle().reply(`Hmmm, your guild is not in the database. Adding...`);
                await state.getDbCore().generateGuildPropertyModel();
                return false;
            } else {
                const guildProp = doc as any as DBGuildPropertySchema;
                let userList = `\`\`\`Current Targets: ${guildProp.targets.length}\n`;
                for (const id of guildProp.targets) {
                    if (guild.client.users.get(id)) {
                        userList += "- " +
                        guild.client.users.get(id).username + "\n";
                    }
                }
                userList += "```";
                state.getMessageHandle().channel.send(userList);
                return true;
            }
        });
    }
}
