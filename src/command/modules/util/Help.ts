import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class Help extends ExecutableCommand {
    public constructor() {
        super("help", AccessLevel.UNREGISTERED, 0, "Displays the help message.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            let text = `\`\`\`Available prefixes: ${state.getCommandManager().getPrefixManager().getPrefixes()}\n\n`;
            const commands = Array.from(state.getCommandManager().getCommandRegistry().getCommandMap().values()).sort((a, b) => {
                if (!a.getCommandString() || !b.getCommandString() || a.getCommandString() === b.getCommandString()) {
                    return 0;
                }
                return a.getCommandString() < b.getCommandString() ? -1 : 1;
            });
            let amount = 0;
            for (const command of commands) {
                if (command instanceof ExecutableCommand) {
                    let description = command.getDescription();
                    if (description[description.length - 1] !== "\n") {
                        description += "\n";
                    }
                    text += `${command.getCommandString()}${command.getUsage() ? ` (${command.getUsage()})` : ""} - ${description}`;
                    amount++;
                }
            }
            text += `\n${amount} Command(s) available\`\`\``;
            state.getMessageHandle().channel.send(text);
            return true;
        });
    }
}
