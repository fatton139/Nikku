import "discord.js";

import { FortniteBotCore } from "./src/core/FortniteBotCore";
import { FortniteBotCommandConfig } from "./src/config/FortniteBotCommandConfig";
import { FortniteBotInitConfig } from "./src/config/FortniteBotInitConfig";
import { FortniteBotDbConfig } from "./src/config/FortniteBotDbConfig";

const keys = {
    discordToken: process.env.discordToken,
    chatBotUserId: process.env.chatBotUserId,
    chatBotAPIKey: process.env.chatBotAPIKey
};


const initConfig = new FortniteBotInitConfig(keys.discordToken,
    keys.chatBotUserId, keys.chatBotAPIKey);

export const fortniteBotDbConfig = new FortniteBotDbConfig(process.env.dbIp);
export const fortniteBotCore = new FortniteBotCore(initConfig);

fortniteBotCore.start();
