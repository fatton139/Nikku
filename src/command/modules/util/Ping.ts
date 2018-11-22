import AccessLevel from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import Config from "config/Config";

export default class Test extends ExecutableCommand {
    public constructor(config: typeof Config) {
        super("ping", AccessLevel.UNREGISTERED, 0, "Test command, responds with pong.");
    }

    public setCustomAction(): Action {
        return new Action((state: OnMessageState) => {
            state.getMessageHandle().channel.send("pong");
            return true;
        });
    }
}
