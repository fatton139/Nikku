import "discord.js";
import { config as dotenvConfig } from "dotenv";
import { FortniteBotCore } from "./src/core/FortniteBotCore";
import { FortniteBotInitConfig } from "./src/config/FortniteBotInitConfig";

dotenvConfig();

const keys = {
    discordToken: process.env.discordToken,
    chatBotUserId: process.env.chatBotUserId,
    chatBotAPIKey: process.env.chatBotAPIKey
};

const initConfig = new FortniteBotInitConfig(keys.discordToken,
    keys.chatBotUserId, keys.chatBotAPIKey);

export const fortniteBotCore = new FortniteBotCore(initConfig);

fortniteBotCore.start();
