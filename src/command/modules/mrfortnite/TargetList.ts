import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class TargetList extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "targetlist",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Retrieves the current targets.",
        });
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const guild = state.getHandle().guild;
            const doc = await DBGuildPropertySchema.getGuildById(guild.id);
            if (!doc) {
                state.getHandle().reply(`Cannot use this command,`
                        + ` this guild is not registered. Register with \`!f registerguild\`.`);
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
                state.getHandle().channel.send(userList);
                return true;
            }
        });
    }
}
