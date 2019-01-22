import * as Discord from "discord.js";
import { AccessLevel } from "user/AccessLevel";
import TriggerableCommand from "command/TriggerableCommand";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";
import { CommandUtil } from "utils/CommandUtil";

export default class FortniteTextEvent extends TriggerableCommand {
    public constructor() {
        super(AccessLevel.UNREGISTERED);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState): Promise<boolean> => {
            const m: Discord.Message = state.getMessageHandle();
            return m.content.replace(/\s/g, "").toLowerCase().search("fortnite") !== -1
                && !CommandUtil.isResponseTrigger(state.getMessageHandle().content, 2)
                && m.content[0] !== "!";
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const guild = state.getMessageHandle().guild;
            const doc = await DBGuildPropertySchema.getGuildById(guild.id);
            if (!doc) {
                state.getMessageHandle().channel.send("<@!455679698610159616> fortnite?");
            } else {
                let targetString = "OwO someone said fortnite? ";
                for (const target of doc.targets) {
                    targetString += "<@!" + target + "> ";
                }
                targetString += doc.targets.length === 0 ? "<@!455679698610159616> fortnite?" : "fortnite?";
                state.getMessageHandle().channel.send(targetString);
            }
            return false;
        });
    }
}
