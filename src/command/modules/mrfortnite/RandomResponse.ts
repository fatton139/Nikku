import * as Discord from "discord.js";
import TriggerableCommand from "command/TriggerableCommand";
import AccessLevel from "user/AccessLevel";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import randInt from "utils/Random";
import Config from "config/Config";
import ChatBotService from "services/ChatBotService";
import StringFunc from "utils/StringFunc";

export default class RandomResponse extends TriggerableCommand {

    private botService: ChatBotService;

    public constructor() {
        super(AccessLevel.UNREGISTERED);
        this.botService = new ChatBotService(Config);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState) => {
            const m = state.getMessageHandle();
            return randInt(0, 100) < 100 && m.content.replace(/\s/g, "").toLowerCase().search("mrfortnite") === -1
                && m.content.replace(/\s/g, "").toLowerCase().search("fortnite") === -1;
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const m: Discord.Message = state.getMessageHandle();
            const str = StringFunc.removeStrBothEndsNoSpace(m.content, "mrfortnite");
            if (str.length === 0) {
                return false;
            }
            try {
                await this.botService.sendMessage(str, m.channel as Discord.TextChannel);
                return true;
            } catch (err) {
                throw err;
            }
        });
    }
}
