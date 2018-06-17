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

const getId = (text: string): string => {
    return text.charAt(2) !== "!" ?
        text.slice(2, text.length - 1) : text.slice(3, text.length - 1);
};

const fortniteTextEvent = {
    trigger: new FortniteBotTrigger((state) => {
        const message = (state.getHandle() as Discord.Message);
        return message.content.replace(/\s/g, "").toLowerCase().search("fortnite") !== -1
            && message.content[0] !== "!";
    }),
    action: new FortniteBotAction(1, (state: FortniteBotState) => {
        (state.getHandle() as Discord.Message).channel.send(
            "OwO someone said fornite? (this is a sample)"
        );
        return true;
    })
};

const pubgTextEvent = {
    trigger: new FortniteBotTrigger((state) => {
        const message = (state.getHandle() as Discord.Message);
        return message.content.replace(/\s/g, "").toLowerCase().search("pubg") !== -1;
    }),
    action: new FortniteBotAction(1, (state: FortniteBotState) => {
        (state.getHandle() as Discord.Message).channel.send(
            "OwO someone said pubg? (this is a sample)"
        );
        return true;
    })
};

const randomTextEvent = {
    trigger: new FortniteBotTrigger(() => {
        return randInt(0, 100) < 5;
    }),
    action: new FortniteBotAction(1, (state: FortniteBotState) => {
        (state.getHandle() as Discord.Message).channel.send(
            "This message only has a 1/25 chance of appearing"
        );
        return true;
    })
};

const pong = new FortniteBotAction(0, (state: FortniteBotState, args) => {
    console.log(args);
    (state.getHandle() as Discord.Message).channel.send("pong");
    return true;
});

const pingTargets = new FortniteBotAction(0, (state: FortniteBotState) => {
    (state.getHandle() as Discord.Message).channel.send(
        "Pinging!"
    );
    return true;
});

const doNothing = new FortniteBotAction(0, (state: FortniteBotState) => {
    return true;
});

const showHelp = new FortniteBotAction(0, (state: FortniteBotState) => {
    (state.getHandle() as Discord.Message).channel.send(
        "``` help response ```"
    );
    return true;
});

const auto = {
    loop: null,
    start: new FortniteBotAction(2, (state: FortniteBotState,
                                     args: any[]) => {
        if (isNaN(args[0]) || isNaN(args[1])) {
            (state.getHandle() as Discord.Message).channel.send(
                "Usage: !f auto `amount` `delay`"
            );
            return;
        }
        if (Number(args[1]) < 1000) {
            (state.getHandle() as Discord.Message).channel.send(
                "Delay must be over 1000ms"
            );
            return;
        }
        this.loop = new Loop(args[0], args[1], (amount: number) => {
            (state.getHandle() as Discord.Message).channel.send(
                "Pinging!"
            );
        });
        this.loop.startLoop();
        this.looping = true;
        return true;
    }),
    stop: new FortniteBotAction(0, (state: FortniteBotState) => {
        this.loop.stopLoop();
        return true;
    })
};

const addTarget = new FortniteBotAction(1,
    (state: PendingResponseState, args: string[]) => {
    const message = state.getHandle() as Discord.Message;
    const id = getId(args[0]);
    if (args.length !== 1) {
        (state.getHandle() as Discord.Message).channel.send(
            "Usage:`!f target `@user``."
        );
        return;
    }
    if (!message.guild.client.users.get(id)) {
        (state.getHandle() as Discord.Message).channel.send(
            "Target must be a user."
        );
        return;
    }
    message.channel.send(args[0] +
        ", Would you like to be added as a target? \n" +
        "`yes` or `no`"
    );
    message.channel.awaitMessages(() => {
        const m = activeCore.getEventCore()
        .getHandles().message as Discord.Message;
        return m.author.id === id;
    }, {
        max: 1,
        time: 300000,
        errors: ["time"]
    }).then(() => {
        const m = activeCore.getCoreState().getHandle() as Discord.Message;
        if (m.content.toLowerCase() === "yes") {
            m.channel.send("Okey, adding you as a target.");
            activeCore.getDbCore().GlobalCollection.addTarget(id, (res) => {
                if (res) {
                    m.channel.send("Added successfully.");
                } else {
                    m.channel.send("Failed to add as target.");
                }
            });
        } else if (m.content.toLowerCase() === "no") {
            m.channel.send("Okey.");
        }
    }).catch(() => {
        message.channel.send("User did not respond in time.");
    });
    return true;
});

const getTargetList = new FortniteBotAction(0, (state: FortniteBotState) => {
    activeCore.getDbCore().GlobalCollection.getTargets((res) => {
        const message = state.getHandle() as Discord.Message;
        let userlist = "```Current Targets: (" + res.length + ")\n";
        for (const id of res) {
            userlist += "- " +
            message.guild.client.users.get(id).username + "\n";
        }
        userlist += "```";
        message.channel.send(userlist);
    });
    return true;
});

const removeTarget = new FortniteBotAction(0, (state: FortniteBotState) => {
    const message = state.getHandle() as Discord.Message;
    const id = message.author.id;
    activeCore.getDbCore().GlobalCollection.removeTarget(id, (res) => {
        if (res) {
            message.channel.send("Removed successfully.");
        } else {
            message.channel.send("Failed to remove.");
        }
    });
    return true;
});

export const defaultCommands = [
    new AutoTriggerCommand(0, randomTextEvent.action, randomTextEvent.trigger),
    new AutoTriggerCommand(0, fortniteTextEvent.action, fortniteTextEvent.trigger),
    new AutoTriggerCommand(0, pubgTextEvent.action, pubgTextEvent.trigger),
    new ExecutableCommand("ping", 0, pong),
    new ExecutableCommand(" ", 0, pingTargets),
    new ExecutableCommand("help", 0, showHelp),
    new ExecutableCommand("auto", 0, auto.start),
    new ExecutableCommand("stop", 0, auto.stop),
    new ExecutableCommand("targetlist", 0, getTargetList),
    new ExecutableCommand("removeself", 0, removeTarget),
    new RequireResponseCommand("target", 0, addTarget)
];
