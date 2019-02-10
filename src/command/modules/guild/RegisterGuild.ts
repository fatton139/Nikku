import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class RegisterGuild extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "registerguild",
            accessLevel: AccessLevel.ADMINISTRATOR,
            argLength: 0,
            description: "Register this guild.",
        });
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const user = state.getHandle().author;
            const guild = state.getHandle().member.guild;
            try {
                const doc = await DBGuildPropertySchema.getGuildById(guild.id);
                if (!doc) {
                    await DBGuildPropertySchema.registerGuild(guild.id);
                    state.getHandle().reply(
                        "Guild successfully registered!");
                    return true;
                } else {
                    state.getHandle().reply("This guild is already registered.");
                    return true;
                }
            } catch (err) {
                state.getHandle().reply("Failed to register guild.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
