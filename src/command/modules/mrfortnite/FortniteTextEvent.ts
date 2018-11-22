import * as Discord from "discord.js";
import AccessLevel from "user/AccessLevel";
import TriggerableCommand from "command/TriggerableCommand";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class FortniteTextEvent extends TriggerableCommand {
    public constructor() {
        super(AccessLevel.UNREGISTERED);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger((state: OnMessageState) => {
            const m: Discord.Message = state.getMessageHandle();
            return m.content.replace(/\s/g, "").toLowerCase().search("fortnite") !== -1;
        });
    }

    public setCustomAction(): Action {
        return new Action((state: OnMessageState) => {
            state.getMessageHandle().channel.send("OwO Someone said fortnite?!?");
            return true;
        });
    }
}
