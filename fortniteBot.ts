import "discord.js";
import { config as dotenvConfig } from "dotenv";
import { FortniteBotCore } from "./src/core/FortniteBotCore";
import { FortniteBotInitConfig } from "./src/config/FortniteBotInitConfig";

dotenvConfig();

const keys = {
    discordToken: process.env.discordToken,
    chatBotUserId: process.env.chatBotUserId,
    chatBotApiKey: process.env.chatBotApiKey
};

const initConfig = new FortniteBotInitConfig(keys.discordToken,
    keys.chatBotUserId, keys.chatBotApiKey);

export const fortniteBotCore = new FortniteBotCore(initConfig);

fortniteBotCore.start();
