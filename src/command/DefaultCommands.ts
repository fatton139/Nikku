import * as Discord from "discord.js";
import { AutoTriggerCommand } from "../command/AutoTriggerCommand";
import { DebugCommand } from "../command/DebugCommand";
import { CommandManager } from "../command/CommandManager";
import { FortniteBotCore } from "../core/FortniteBotCore";
import { randInt } from "../utils/Random";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { FortniteBotTrigger } from "../action/FortniteBotTrigger";
import { ExecutableCommand } from "../command/ExecutableCommand";
import { FortniteBotInitConfig } from "../config/FortniteBotInitConfig";
import { CommandExecutionState } from "../state/CommandExecutionState";
import { fortniteBotCore as activeCore } from "../../fortniteBot";
import { DiscordAPIError } from "discord.js";

const trigger50 = new FortniteBotTrigger(() => {
    // console.log("trigger");
    return randInt(0, 100) > 50;
});

const a = new FortniteBotAction(1, () => {
    // console.log("action exec");
    return true;
});

const pong = new FortniteBotAction(0, (state: CommandExecutionState) => {
    state.messageHandle.channel.send("pong");
    return true;
});

    return true;
});

export const defaultCommands = [
    new AutoTriggerCommand("test command", 1, a, trigger50),
    new ExecutableCommand("ping", 0, pong),
];
