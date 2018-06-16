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
    let id = args[0].slice(3, args[0].length - 1);
    if (args[0].charAt(2) !== "!") {
        id = args[0].slice(2, args[0].length - 1);
    }
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
        } else if (m.content.toLowerCase() === "no") {
            m.channel.send("Okey.");
        }
    }).catch(() => {
        message.channel.send("User did not respond in time.");
    });
    return true;
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
];
