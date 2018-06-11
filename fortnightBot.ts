import "discord.js";

import * as core from "./src/core/FortnightBotCore";
import * as commandConfig from "./src/config/FortnightBotCommandConfig";
import * as config from "./src/config/FortnightBotInitConfig";

import "./temp";

const keys = {
    discordToken: process.env.discordToken,
    chatBotUserId: process.env.chatBotUserId,
    chatBotAPIKey: process.env.chatBotAPIKey
};

const initConfig = new config.FortnightBotInitConfig(keys.discordToken,
    keys.chatBotUserId, keys.chatBotAPIKey);

const fortnightBotCore = new core.FortnightBotCore(initConfig);
