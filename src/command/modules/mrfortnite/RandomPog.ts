import TriggerableCommand from "command/TriggerableCommand";
import { AccessLevel } from "user/AccessLevel";
import Trigger from "action/Trigger";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import { MathUtil } from "math/MathUtil";

export default class RandomPog extends TriggerableCommand {

    public constructor() {
        super(AccessLevel.UNREGISTERED);
    }

    public setCustomTrigger(): Trigger {
        return new Trigger(async (state: OnMessageState): Promise<boolean> => {
            return MathUtil.randInt(0, 100) < 5;
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            try {
                setTimeout(async () => {
                    await state.getHandle().react(process.env.POG_EMOJI_ID || "414252950677094401");
                }, MathUtil.randInt(0, 20) * 1000);
                return true;
            } catch (err) {
                throw err;
            }
        });
    }
}
