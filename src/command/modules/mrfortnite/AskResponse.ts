import * as Discord from "discord.js";
import TriggerableCommand from "command/TriggerableCommand";
import AccessLevel from "user/AccessLevel";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import Config from "config/Config";
import ChatBotService from "services/ChatBotService";
import StringFunc from "utils/StringFunc";

export default class AskResponse extends TriggerableCommand {

    private botService: ChatBotService;

    public constructor() {
        super(AccessLevel.UNREGISTERED);
        this.botService = new ChatBotService(Config);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState): Promise<boolean> => {
            const m: Discord.Message = state.getMessageHandle();
            return m.content.replace(/\s/g, "").toLowerCase().search("mrfortnite") !== -1;
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            try {
                return await this.botService.sendMessage(state);
            } catch (err) {
                throw err;
            }
        });
    }
}
