import { AccessLevel } from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class PingDb extends ExecutableCommand {
    public constructor() {
        super("pingdb", AccessLevel.UNREGISTERED, 0,
            "Test command, calculates the time it takes to get a response from the database.");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const start: Date = new Date();
            await state.getDbCore().getDb().stats();
            const diff = (new Date().getTime() as any) - (start.getTime() as any);
            state.getMessageHandle().channel.send(`pong in \`${diff}ms\`.`);
            return true;
        });
    }
}
