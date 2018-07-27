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
import { Item } from "../shop/Item";
import { getId } from "../utils/CommandUtil";

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
        m.channel.send("Shop not found.");
        return;
    }
    updateDiscounts((c: boolean) => {
        if (c) {
            m.channel.send("```" + Shops[index].getInventory() + "```");
        } else {
            m.channel.send("Getting shop data failed :(");
            return false;
        }
    });

    return true;
});

const buy = new FortniteBotAction(0,
    (state: PendingResponseState, args: string[]) => {
    let m: Discord.Message = state.getHandle();
    if (args.length < 3) {
        (state.getHandle() as Discord.Message).channel.send(
            "Usage: !f buy `index/item` from `shopname`."
        );
        return;
    }
    const shopName = args.join(" ").split("from")[1];
    const itemName: any = args.join(" ").split("from")[0];
    const shopIndex = Shops.findIndex((shop: Shop) =>
        shop.name.replace(/\s/g, "").toLowerCase() ===
        shopName.replace(/\s/g, "").toLowerCase()
    );
    if (shopIndex === -1) {
        m.channel.send("Shop not found.");
        return;
    }
    updateDiscounts((c: boolean) => {
        if (!c) {
            m.channel.send("Getting shop data failed :(");
            return false;
        }
        const inventory: Item[] = Shops[shopIndex].inventory;
        let selectedItem: Item;
        if (!isNaN(itemName)) {
            if (inventory[Number(itemName)]) {
                selectedItem = inventory[Number(itemName)];
            } else {
                m.reply("Item not found.");
                return;
            }
        } else {
            const itemIndex = inventory.findIndex((item: Item) =>
                item.name.replace(/\s/g, "").toLowerCase() ===
                itemName.replace(/\s/g, "").toLowerCase()
            );
            if (itemIndex !== -1) {
                selectedItem = inventory[itemIndex];
            } else {
                m.reply("Item not found.");
                return;
            }
        }
        const db = activeCore.getDbCore();
        db.collections.user.getUser(m.author.id, (res: User) => {
            console.log(res);
            if (!res) {
                return false;
            }
            if (res.currency[selectedItem.cost.coinType] <
                selectedItem.cost.value) {
                m.reply("You do not have enough **" +
                    selectedItem.cost.coinType + "**."
                );
                return;
            }
            m.reply("You selected **" + selectedItem.name + "**. Buy?\n" +
                "`yes` or `no`."
            );
            m.channel.awaitMessages(() => {
                return state.updateHandle().author.id === m.author.id;
            }, {
                max: 1,
                time: 300000,
                errors: ["time"]
            }).then((response) => {
                m = state.updateHandle();
                if (response.first().content === "yes") {
                    m.channel.send("Buying...");
                    db.collections.user.getUser(m.author.id, (u: User) => {
                        if (!u) {
                            return false;
                        }
                        const a = new User(u.id, u.accessLevel);
                        a.currency.DotmaCoin = u.currency.DotmaCoin -
                            selectedItem.cost.value;
                        a.title.active = selectedItem.name;
                        a.title.list.push(selectedItem.name);
                        db.collections.user.replace(a, (res1: boolean) => {
                            if (!res1) {
                                return false;
                            }
                            m.channel.send("Purchase Complete!");
                        });
                    });
                } else if (response.first().content === "no") {
                    m.channel.send("Okey.");
                }
            }).catch(() => {
                m.reply("You did not respond in time.");
            });
        });
    });

    return true;
});

export const shopCommands = [
    new ExecutableCommand("shoplist", 0, shopList),
    new ExecutableCommand("viewshop", 0, viewShop),
    new RequireResponseCommand("buy", 1, buy)
];
