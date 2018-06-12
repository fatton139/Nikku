import "discord.js";

import { FortniteBotCore } from "./src/core/FortniteBotCore";
import { FortniteBotCommandConfig } from "./src/config/FortniteBotCommandConfig";
import { FortniteBotInitConfig } from "./src/config/FortniteBotInitConfig";

import "./temp";

const initConfig = new FortniteBotInitConfig(keys.discordToken,
    keys.chatBotUserId, keys.chatBotAPIKey);

const fortniteBotCore = new FortniteBotCore(initConfig);

fortniteBotCore.start();
