import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import { core } from "core/NikkuCore";
import CommandManager from "managers/CommandManager";

export default class Help extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "help",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Displays the help message.",
        });
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            const commandManager = core.getManager(CommandManager);
            let text = `\`\`\`Available prefixes: ${commandManager.getPrefixManager().getPrefixes()}\n\n`;
            const commands = Array.from(commandManager.getCommandRegistry().getRegistryMap().values()).sort((a, b) => {
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
            state.getHandle().channel.send(text);
            return true;
        });
    }
}
