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

const updateDiscounts = (callback: (res: boolean) => void) => {
    const db = activeCore.getDbCore();
    db.collections.global.get((res: any[]) => {
        const lastUpdate = res[0].shops.lastUpdate;
        const d = (new Date() as any) - (lastUpdate);
        const hour = d / (1000 * 60 * 60);
        if (hour > 0.25) {
            db.collections.global.update("shops.lastUpdate", new Date(),
            (c: boolean) => {
                if (c) {
                    for (const shop of Shops) {
                        if (shop.allowDiscounts) {
                            shop.setRandomDiscount(randInt(1, 5));
                        }
                    }
                    callback(c);
                }
            });
        } else {
            callback(true);
        }
    });
};

const viewShop = new FortniteBotAction(0, (state: FortniteBotState,
                                           args: string[]) => {
    const m = (state.getHandle() as Discord.Message);
    const shopName = args.join(" ");
    const index = Shops.findIndex((shop: Shop) =>
        shop.name.replace(/\s/g, "").toLowerCase() ===
            shopName.replace(/\s/g, "").toLowerCase());
    if (index === -1) {
        m.channel.send("Shop not found");
        return;
    }
    updateDiscounts((c: boolean) => {
        if (c) {
            m.channel.send("```" + Shops[0].getInventory() + "```");
        } else {
            m.channel.send("Getting shop data failed :(");
            return false;
        }
    });

    return true;
});

export const shopCommands = [
    new ExecutableCommand("shoplist", 0, shopList),
    new ExecutableCommand("viewshop", 0, viewShop)
];
