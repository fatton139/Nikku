import * as Discord from "discord.js";
import { AutoTriggerCommand } from "../command/AutoTriggerCommand";
import { DebugCommand } from "../command/DebugCommand";
import { randInt } from "../utils/Random";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { FortniteBotTrigger } from "../action/FortniteBotTrigger";
import { ExecutableCommand } from "../command/ExecutableCommand";
import { RequireResponseCommand } from "../command/RequireResponseCommand";
import { fortniteBotCore as activeCore } from "../../fortniteBot";
import { PendingResponseState } from "state/PendingResponseState";
import { FortniteBotState } from "state/FortniteBotState";
import { Loop } from "../utils/Loop";
import { User } from "../user/User";
import { Shop } from "../shop/Shop";
import { Shops } from "../shop/Shops";

const shopList = new FortniteBotAction(0, (state: FortniteBotState,
                                           args: string[]) => {
    const m = (state.getHandle() as Discord.Message);
    let text = "```" + Shops.length + " Shops are avaliable." +
        " View with !f viewshop\n";
    for (const shop of Shops) {
        text += shop.description ? shop.name + " - " + shop.description :
            shop.name;
        text += "\n";
    }
    text += "```";
    m.channel.send(text);
    return true;
});


export const shopCommands = [
    new ExecutableCommand("shoplist", 0, shopList),
];
