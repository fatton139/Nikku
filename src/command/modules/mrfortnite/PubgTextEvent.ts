import * as Discord from "discord.js";
import { AccessLevel } from "user/AccessLevel";
import TriggerableCommand from "command/TriggerableCommand";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class PubgTextEvent extends TriggerableCommand {
    public constructor() {
        super(AccessLevel.UNREGISTERED);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState): Promise<boolean> => {
            const m: Discord.Message = state.getHandle();
            return m.content.replace(/\s/g, "").toLowerCase().search("pubg") !== -1
                && m.content[0] !== "!";
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            state.getHandle().channel.send("OwO someone said PUBG?").then(() => {
                return true;
            }, () => {
                return false;
            });
            return false;
        });
    }
}
