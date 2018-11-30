import * as Discord from "discord.js";
import AccessLevel from "user/AccessLevel";
import TriggerableCommand from "command/TriggerableCommand";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class FortniteTextEvent extends TriggerableCommand {
    public constructor() {
        super(AccessLevel.UNREGISTERED);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState): Promise<boolean> => {
            const m: Discord.Message = state.getMessageHandle();
            return m.content.replace(/\s/g, "").toLowerCase().search("fortnite") !== -1
                && m.content.replace(/\s/g, "").toLowerCase().search("mrfortnite") === -1
                && m.content[0] !== "!";
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const guildId = state.getMessageHandle().guild.id;
            const doc = await state.getDbCore().getGuildPropertyModel().findOne({id: guildId});
            if (!doc) {
                await state.getDbCore().generateGuildPropertyModel();
                state.getMessageHandle().channel.send("<@!455679698610159616> fortnite?");
                return false;
            } else {
                const guild = doc as any as DBGuildPropertySchema;
                let targetString = "OwO someone said fortnite? ";
                for (const target of guild.targets) {
                    targetString += "<@!" + target + "> ";
                }
                targetString += guild.targets.length === 0 ? "<@!455679698610159616> fortnite?" : "fortnite?";
                state.getMessageHandle().channel.send(targetString);
            }
            return false;
        });
    }
}
