import { AutoTriggerCommand } from "../command/AutoTriggerCommand";
import { CommandManager } from "../command/CommandManager";

import { randInt } from "../utils/Random";

export const defaultCommands = [
    new AutoTriggerCommand("test command", 1, () => {
        console.log("action executed");
        return true;
    }, () => {
        return randInt(0, 100) > 50;
    })
];
