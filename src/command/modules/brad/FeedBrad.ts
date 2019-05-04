import * as Discord from "discord.js";
import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";
import DBBradPropertySchema, { IdContributionPair } from "database/schemas/DBBradPropertySchema";
import { CoinType } from "user/CoinType";
import Brad from "entities/Brad";

export default class FeedBrad extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "feedbrad",
            accessLevel: AccessLevel.REGISTERED,
            argLength: 1,
            description: "Feeds Brad.",
            usage: "!f feedbrad [amount]",
        });
    }

    private generateString(users: IdContributionPair[], client: Discord.Client): string {
        let str = "";
        for (const user of users) {
            const u = client.users.get(user.id);
            if (!u) {
                continue;
            }
            str += `**${u.username}** ` +
            `contributing ${Brad.dotmaCoinsToKg(user.contribution).toFixed(4)}kg to Brad's weight.\n`;
        }
        return str;
    }

    private async awardUsers(state: OnMessageState, users: IdContributionPair[], DbBrad: DBBradPropertySchema): Promise<void> {
        const channel = state.getHandle().channel;
        const client = state.getCore().getClient();
        const embed = new Discord.RichEmbed();
        embed.setTitle("Brad is pleased.");
        embed.setColor(0x00FFF0);
        let awardIndex = 0;
        for (let i = 0; i < users.length && i < 10; i++) {
            const dbUser = await DBUserSchema.getUserById(users[i].id);
            const user = client.users.get(users[i].id);
            if (!dbUser || !user) {
                continue;
            }
            if (awardIndex === 0) {
                // await dbUser.addCurrency(CoinType.DOTMA_COIN, 1500);
                // await dbUser.addCurrency(CoinType.BRAD_COIN, 1);
                embed.addField("First Place!",
                    `Congrats to **${user.username}** ` +
                    `contributing ${Brad.dotmaCoinsToKg(users[i].contribution).toFixed(4)}kg to Brad's weight.\n` +
                    `Brad donates 1 **BradCoin**™© and 1500 **DotmaCoins**™©.`,
                );
            } else if (awardIndex < 5 && awardIndex > 0) {
                // await dbUser.addCurrency(CoinType.DOTMA_COIN, 1000);
                embed.addField("Second to Fifth Place!",
                    `Congrats to\n` +
                    `${this.generateString(users.slice(1, 5), client)}` +
                    `Brad donates 1000 **DotmaCoins**™© to each.`,
                );
            } else {
                // await dbUser.addCurrency(CoinType.DOTMA_COIN, 500);
                embed.addField("Sixth to Tenth Place!",
                    `Congrats to\n` +
                    `${this.generateString(users.slice(6, 10), client)}\n` +
                    `Brad donates 500 **DotmaCoins**™© each.`,
                );
            }
            awardIndex++;
        }
        channel.send(embed);
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState, args: string[]): Promise<boolean> => {
            const user = state.getHandle().author;
            try {
                if (isNaN(args[0] as any)) {
                    state.getHandle().reply("Usage: PREFIX feedbrad `amount`");
                    return false;
                }
                const amount: number = parseInt(args[0], 10);
                if (amount <= 0) {
                    state.getHandle().reply("Amount must be positive.");
                    return false;
                }
                const DbUser = await DBUserSchema.getUserById(user.id);
                if (!DbUser) {
                    return false;
                }
                if (DbUser.wallet.dotmaCoin < amount) {
                    state.getHandle().reply("You do not have sufficient DotmaCoins.");
                    return false;
                }
                const DbBrad = await DBBradPropertySchema.getBrad();
                if (!DbBrad) {
                    return false;
                }
                await Promise.all([DbBrad.incrementWeight(user.id, amount), DbUser.removeCurrency(CoinType.DOTMA_COIN, amount)]);
                state.getHandle().reply(
                    `Successfully fed Brad. ` +
                    `Brad has gained **${Brad.dotmaCoinsToKg(amount).toFixed(4)}** kg!`,
                );
                if (DbBrad.weight >= DbBrad.weightGoal) {
                    await this.awardUsers(state, DbBrad.contributors.sort((a, b) => b.contribution - a.contribution), DbBrad);
                    await DbBrad.setNewWeightGoal();
                    await DbBrad.resetCurrentRun();
                }
                return true;
            } catch (err) {
                state.getHandle().reply("Failed to feed Brad :(.");
                if (err) {
                    this.logger.warn(err.message);
                }
                return false;
            }
        });
    }
}
