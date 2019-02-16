/*
    Note: This may not be 100% GDPR compliant as it is still being worked on.
    Logic:
    If arg is update, respond with message about updating their user profile in Discord as there is no information stored in DB
        that is user updatable
    If arg is download, DM the user a copy of the raw data from the database (unsure about format)
    If arg is delete, confirm with user - if yes deregister and then delete from db
    If arg is ignore, confirm with user - if yes confirm if they wish to delete existing data - if yes run delete method, if no
        add user to ignore list
*/

import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";
import * as moment from "moment";

export default class GDPRCommand extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "gdpr",
            accessLevel: AccessLevel.REGISTERED,
            argLength: 1,
            description: "Download or delete your user data from NikkuBot's database.",
            usage: "!f gdpr (update / download / delete)",
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState, args: string[]): Promise<boolean> => {
            const user = state.getHandle().author;

            if (!args[0]) { // If the user doesn't specify an argument - shouldn't technically see this
                state.getHandle().channel.send("No argument specified - Please specify an argument.");
                return false;

            } else if (args[0] === "update") { // If the user wants to update their information
                state.getHandle().channel.send("NikkuBot does not store any information that can be modified by users. Please modify" +
                                               " your user data through Discord and it will be updated in NikkuBot.");
                return true;

            } else if (args[0] === "download") { // If the user wants to download their information
                const doc = await DBUserSchema.getUserById(user.id); // get user's data from db
                if (!doc) { // somehow the user isn't registered?
                    state.getHandle().channel.send("Error: User isn't registered - you shouldn't be seeing this, so do the ha ha if you" +
                                                   "are seeing this. Quick, bjoy react this message!"); // if u see this alex is a clown
                    return false;

                } else { // what actually should happen 100% of the time
                    try {
                        state.getHandle().reply("we're sending your data via direct message now.");
                        await state.getHandle().author.send(`Here's your user data, current as of ${moment().format()}.`);
                        await state.getHandle().author.send(`\`\`\`${doc.toString()}\`\`\``);
                        return true; // ye we done lmao
                    } catch (err) {
                        state.getHandle().reply("we couldn't send you a direct message. Please enable DMs from me or the server.");
                        this.logger.warn(err.message);
                        return false;
                    }
                }

            } else if (args[0] === "delete") {
                state.getHandle().channel.send("To confirm deletion of your user data, please type \`!f unregister\` in chat. " +
                "Be careful! This will permanently remove all of your user data from NikkuBot immediately. " +
                "Your user data on Discord will not be affected.");
                return true;

            } else { // arg other than one that's specified
                state.getHandle().channel.send("Please specify an argument.");
                return false;
            }

            return false; // ye shouldn't get here at all but better safe than sorry lmao!!
        });
    }
}
