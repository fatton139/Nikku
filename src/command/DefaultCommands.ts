import { AutoTriggerCommand } from "../command/AutoTriggerCommand";
import { DebugCommand } from "../command/DebugCommand";
import { CommandManager } from "../command/CommandManager";
import { FortniteBotCore } from "../core/FortniteBotCore";

import { randInt } from "../utils/Random";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { FortniteBotTrigger } from "../action/FortniteBotTrigger";

const trigger50 = new FortniteBotTrigger(() => {
    console.log("trigger");
    return randInt(0, 100) > 50;
});

const a = new FortniteBotAction(1, () => {
    console.log("action exec");
    return true;
});

export const defaultCommands = [
    new AutoTriggerCommand("test command", 1, a, trigger50)
];
