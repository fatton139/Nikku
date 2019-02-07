import { AccessLevel } from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class Ping extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "ping",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Test command, responds with pong.",
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            state.getHandle().channel.send("pong");
            return true;
        });
    }
}
