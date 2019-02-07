import { AccessLevel } from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DatabaseCore from "core/DatabaseCore";

export default class PingDb extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "pingdb",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Test command, calculates the time it takes to get a response from the database.",
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const start: Date = new Date();
            await DatabaseCore.getDb().stats();
            const diff = (new Date().getTime() as any) - (start.getTime() as any);
            state.getHandle().channel.send(`pong in \`${diff}ms\`.`);
            return true;
        });
    }
}
