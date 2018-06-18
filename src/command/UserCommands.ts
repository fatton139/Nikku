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
        m.channel.send("Usage: !f setaccess `@user` `accessLevel`");
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
        m.channel.send("Usage: !f removeuser `@user`");
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

export const userCommands = [
    new ExecutableCommand("register", 0, register),
    new ExecutableCommand("profile", 0, profile),
    new DebugCommand("setaccess", setAccess),
    new DebugCommand("userlist", listUsers),
    new DebugCommand("removeuser", removeUser)
];
