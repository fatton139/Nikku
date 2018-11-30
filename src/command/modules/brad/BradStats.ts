import * as Discord from "discord.js";
import ExecutableCommand from "command/ExecutableCommand";
import AccessLevel from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBBradPropertySchema, { IdContributionPair } from "database/schemas/DBBradPropertySchema";
import Brad from "entities/Brad";

export default class BradStats extends ExecutableCommand {
    public constructor() {
        super("bradstats", AccessLevel.UNREGISTERED, 0, "View Brad stats.");
    }

    private getUserString(state: OnMessageState, users: IdContributionPair[]): string {
        let str = "";
        let index = 1;
        for (const pair of users.sort((a, b) => b.contribution - a.contribution)) {
            str += `(${index}) ${state.getCore().getClient().users.get(pair.id).username}: ` +
            `${Brad.dotmaCoinsToKg(pair.contribution).toFixed(4)}kg\n`;
            index++;
            if (index === 11) {
                break;
            }
        }
        return str;
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            try {
                const DbBrad = await state.getDbCore().getBradPropertyModel().findOne({}) as any as DBBradPropertySchema;
                const embed = new Discord.RichEmbed();
                embed.setColor(0xFFA600);
                embed.setTitle("Brad Stats.");
                embed.addField("Current Weight", `${DbBrad.weight.toFixed(4)}kg.`);
                if (DbBrad.contributors.length !== 0) {
                    embed.addField(`Top Contributors (Current Run)`,
                    `${this.getUserString(state, DbBrad.contributors)}`);
                }
                if (DbBrad.contributorsAllTime.length !== 0) {
                    embed.addField(`Top Contributors (All time)`,
                    `${this.getUserString(state, DbBrad.contributorsAllTime)}`);
                }
                state.getMessageHandle().channel.send(embed);
                return true;
            } catch (err) {
                state.getMessageHandle().reply("Could not retrieve Brad data.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
