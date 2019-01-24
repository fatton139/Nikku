import * as Discord from "discord.js";
import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";
import { Config } from "config/Config";

export default class ViewConfig extends ExecutableCommand {
    public constructor() {
        super("viewconfig", AccessLevel.MODERATOR, 0, "View bot configurations.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            try {
                const guild = await DBGuildPropertySchema.getGuildById(state.getHandle().guild.id);
                const configs = await guild.getAllBooleanConfig();
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Bot Configurations.");
                embed.setDescription("Current Bot Configurations. Edit with the **setConfig** command.");
                embed.setColor(0xE600AC);
                embed.setAuthor(state.getCore().getClient().user.username);
                let values = "";
                for (const key of Object.keys(configs)) {
                    values += `${key} - ${configs[key]}\n`;
                }
                embed.addField("Boolean Configurations", values);
                embed.setTimestamp(new Date());
                embed.setFooter(Config.Command.BOT_RESPONSE_TRIGGER);
                state.getHandle().channel.send(embed);
                return true;
            } catch (err) {
                throw err;
            }
        });
    }
}
