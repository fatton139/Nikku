import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";

/**
 * Commands which are auto triggered.
 */

export class AutoTriggerCommand extends Command implements ICommand {
    public name: string;
    public trigger: () => boolean;
    public constructor(name: string, accessLevel: number, action: () => boolean,
                       trigger: () => boolean) {
        super(null, accessLevel, action);
        this.name = name;
        this.trigger = trigger;
    }
    public tryTrigger(): boolean {
        return this.trigger();
    }
}
