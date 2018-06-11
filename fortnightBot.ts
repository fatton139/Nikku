import "discord.js";

import { FortnightBotCore } from "./src/core/FortnightBotCore";
import { FortnightBotCommandConfig } from "./src/config/FortnightBotCommandConfig";
import { FortnightBotInitConfig } from "./src/config/FortnightBotInitConfig";

import "./temp";

const keys = {
    discordToken: process.env.discordToken,
    chatBotUserId: process.env.chatBotUserId,
    chatBotAPIKey: process.env.chatBotAPIKey
};

const initConfig = new FortnightBotInitConfig(keys.discordToken,
    keys.chatBotUserId, keys.chatBotAPIKey);

const fortnightBotCore = new FortnightBotCore(initConfig);

fortnightBotCore.start();
