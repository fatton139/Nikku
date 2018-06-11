import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";

/**
 * Commands which are auto triggered.
 */

export class AutoTriggerCommand extends Command implements ICommand {
    public trigger: () => boolean;
    public constructor(action: () => boolean, trigger: () => boolean) {
        super(action, null);
        this.trigger = trigger;
    }
    public tryTrigger(): boolean {
        if (this.trigger) {
            if (!this.executeAction()) {
                throw new Error("Failed Command");
            }
            return true;
        }
        return false;
    }
}
