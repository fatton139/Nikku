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

const getId = (text: string): string => {
    return text.charAt(2) !== "!" ?
        text.slice(2, text.length - 1) : text.slice(3, text.length - 1);
};

const register = new FortniteBotAction(0, (state: FortniteBotState) => {
    const m = state.getHandle() as Discord.Message;
    const id = m.author.id;
    const db = activeCore.getDbCore();
    db.collections.user.get((res) => {
        if (res.findIndex((user: User) => user.id === id) !== -1) {
            m.reply("You are already registered.");
            return;
        }
        db.collections.user.add(new User(id, 1), (c: boolean) => {
            if (c) {
                m.channel.send("Successfully registered!" +
                " You now have access to **Level 1** Commands"
                );
            } else {
                m.channel.send("Failed to register");
            }
        });
    });
    return true;
});

const setAccess = new FortniteBotAction(2, (state: FortniteBotState,
                                            args: any[]) => {
    const m = (state.getHandle() as Discord.Message);
    if (args.length !== 2 || isNaN(args[1])) {
        m.channel.send("Usage: !f -setaccess `@user` `accessLevel`");
        return;
    }
    const id = getId(args[0]);
    if (!m.guild.client.users.get(id)) {
        (state.getHandle() as Discord.Message).channel.send(
            "Target must be a user."
        );
        return;
    }
    const db = activeCore.getDbCore();
    console.log(id, Number(args[1]));
    db.collections.user.update(id, "accessLevel", Number(args[1]), (res) => {
        if (res) {
            m.channel.send("Updated successfully");
        }
    });
    return true;
});

const listUsers = new FortniteBotAction(2, (state: FortniteBotState,
                                            args: any[]) => {
    const db = activeCore.getDbCore();
    db.collections.user.get((res) => {
        console.log(res);
    });
    return true;
});

const removeUser = new FortniteBotAction(1, (state: FortniteBotState,
                                             args: any[]) => {
    const m = state.getHandle() as Discord.Message;
    if (args.length !== 1) {
        m.channel.send("Usage: !f -removeuser `@user`");
        return;
    }
    const id = getId(args[0]);
    const db = activeCore.getDbCore();
    db.collections.user.removeUser(id, (c) => {
        if (c) {
            m.channel.send("User removed.");
        } else {
            m.channel.send("Failed to remove user.");
        }
    });
    return true;
});

const profile = new FortniteBotAction(0, (state: FortniteBotState) => {
    const m = state.getHandle() as Discord.Message;
    const db = activeCore.getDbCore();
    db.collections.user.get((res) => {
        const id = m.author.id;
        const index = res.findIndex((user: User) => user.id === id);
        if (index === -1) {
            m.reply(
                "You are not a registered user. Register with `!f register`"
            );
            return;
        }
        const u: User = res[index];
        m.reply("```" + m.guild.client.users.get(id).username
            + " - " + u.title + "\n"
            + "Access Level: " + u.accessLevel + "\n"
            + "Currency:" + "\n"
            + "\t" + "DotmaCoin: " + u.currency.DotmaCoin + "\n"
            + "\t" + "BradCoin: " + u.currency.BradCoin + "\n"
        + "```");
    });
    return true;
});

const addRemoveCoin = (state: FortniteBotState, args: any[], add: boolean) => {
    const m = (state.getHandle() as Discord.Message);
    if (args.length !== 3 || isNaN(args[2])) {
        if (!add) {
            m.channel.send("Usage: !f -removecoin `@user` `coinType` `Amount`");
            return;
        }
        m.channel.send("Usage: !f -addcoin `@user` `coinType` `Amount`");
        return;
    }
    const id = getId(args[0]);
    if (!m.guild.client.users.get(id)) {
        (state.getHandle() as Discord.Message).channel.send(
            "You must specifiy a user."
        );
        return;
    }
    const db = activeCore.getDbCore();
    db.collections.user.get((res: User[]) => {
        const index = res.findIndex((user: User) => user.id === id);
        if (index === -1) {
            m.reply(
                "Target not a registered user."
            );
            return;
        }
        for (const field of Object.keys(new User(null, 0).currency)) {
            if (args[1] === field) {
                let newVal = res[index].currency[field] + Number(args[2]);
                if (!add) {
                    newVal = (res[index].currency[field] - Number(args[2]) > 0)
                        ? res[index].currency[field] - Number(args[2]) : 0;
                }
                db.collections.user.update(id, "currency." + field, newVal,
                    (c: boolean) => {
                        if (c) {
                            m.channel.send("Updated successfully");
                        } else {
                            m.channel.send("Fail to update user");
                        }
                        return true;
                });
                return;
            }
        }
        m.channel.send("Not a valid coinType.");
    });
};

const addCoin = new FortniteBotAction(3, (state: FortniteBotState,
                                          args: any[]) => {
    addRemoveCoin(state, args, true);
    return true;
});

const removeCoin = new FortniteBotAction(3, (state: FortniteBotState,
                                             args: any[]) => {
    addRemoveCoin(state, args, false);
    return true;
});

const getDaily = new FortniteBotAction(0, (state: FortniteBotState) => {
    const m = (state.getHandle() as Discord.Message);
    const db = activeCore.getDbCore();
    db.collections.user.get((res: User[]) => {
        const index = res.findIndex((user: User) => user.id === m.author.id);
        if (index === -1) {
            return;
        }
        const u: User = res[index];
        const d = (new Date() as any) - (u.daily.lastUpdate.DotmaCoin as any);
        const hour = d / (1000 * 60 * 60);
        if (hour > 24) {
            db.collections.user.update(m.author.id,
                "daily.lastUpdate.DotmaCoin", new Date(), (c1: boolean) => {
                if (!c1) {
                    // TODO
                }
                db.collections.user.incrementCoin(m.author.id,
                    "DotmaCoin", 100, (c2: boolean) => {
                    if (!c2) {
                        // TODO
                    }
                    m.reply("You got 100 **DotmaCoins**™©!");
                });
            });
            return;
        }
        const hourRem = Math.floor(24 - hour);
        const minRem = Math.floor(((24 - hour) - Math.floor(24 - hour)) * 60);
        m.reply("Try again in **" + hourRem + " Hours and "
            + minRem + " Minutes**."
        );
    });
    return true;
});

export const userCommands = [
    new ExecutableCommand("register", 0, register),
    new ExecutableCommand("profile", 1, profile),
    new ExecutableCommand("daily", 1, getDaily),
    new DebugCommand("-setaccess", setAccess),
    new DebugCommand("-userlist", listUsers),
    new DebugCommand("-removeuser", removeUser),
    new DebugCommand("-addcoin", addCoin),
    new DebugCommand("-removecoin", removeCoin)
];
