# Nikku 3

[![Build status](https://ci.appveyor.com/api/projects/status/q77lx59u0k6sf34q?svg=true)](https://ci.appveyor.com/project/aXises/nikkubot)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e12d96ca6dfd4a80a4063eb97cd24837)](https://app.codacy.com/app/aXises/fortniteBot?utm_source=github.com&utm_medium=referral&utm_content=aXises/fortniteBot&utm_campaign=badger)
[![Maintainability](https://api.codeclimate.com/v1/badges/51cbd263ff1f0afff332/maintainability)](https://codeclimate.com/github/aXises/fortniteBot/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Nikku is a customizable bot framework allowing anyone to create a Discord bot within minutes with a simple and modular command creation system. Written in TypeScript, Nikku provides the tools and helpers necessary for anyone to create both simple and advanced bots.

Nikku is built upon a piece of code developed in DECO2800-2018, relying primarily on a software design pattern known as the [**Strategy Pattern**](https://en.wikipedia.org/wiki/Strategy_pattern). Users are provided with sets of controlled data used in the development of their bots allowing controlled algorithms (commands) to be written that complies with [Discord.js](https://github.com/discordjs/discord.js/).

## Features
- Start a Discord bot in less than 20 lines.
- Simple command creation and registration system.
- Built-in logging and event handling.
- Helpers for basic and advanced command designs.
- Configurable runtime settings (More being added).

## Notable Upcoming Features
- Worker threads and sharding.
- Command builders and generators.
- Command event handler/dispatchers.
- Built-in database systems and models.
- Admin management controls.
- Integrated user systems.
- Component/packages module system.
- Server API.
- Integrated Dashboard.

## Contributing
All contributions are welcome. Adhering to *tslint* is recommended.

## Examples

**[Mr Fortnite](https://github.com/aXises/MrFortnite)** is powered by Nikku and can be invited from **[here](https://discordapp.com/api/oauth2/authorize?client_id=455679698610159616&permissions=0&scope=bot)**. Mr Fortnite runs on Nikku developmental branches so things may fail. Feel free to submit an issue regarding the break.


## Getting Started

The following sections will provide a general overview for setting up and adding basic commands to your bot.

### Getting the package
`npm install nikku` or `yarn add nikku`

Add typings if using TypeScript

`npm install @types/nikku` or `yarn add @types/nikku`

### Starting the bot
All bots are initialized through `NikkuCore`.

```
import * as Nikku from "nikku";

const initializer = {
    configurationPath: "config.json",
};

const core = new Nikku.NikkuCore(initializer);

core.start();
```
### Initializer
The initializer determines locations of the config files Nikku should read from and the following values can be configured.

Available options:
- **initializeImmediately**: Optional boolean. Defaults to `false`. Whether to start the bot as soon as the core has been instantiated.

- **configurationPath**: Optional string. Defaults to `botconfig.json`. Specifies where Nikku should find the configurations for the bot.

- **dotenvPath**: Optional string. Defaults to `.env`. Specifies where Nikku should find its environment configurations from.

### Example configs and .env files.
config.json.
```
{
    BOT_RESPONSE_TRIGGER: "bot_name",
    MODULE_PATHS: ["/dev", "/commands"],
    COMMAND_PREFIXES: ["!", "!f"],
    REQUIRE_SPACE_AFTER_PREFIX: false
}
```
Available options:
- **BOT_RESPONSE_TRIGGER**: Optional string. The string which will be used to trigger chat bot services.

- **MODULE_PATHS**: Optional string array. Specifies initial paths to search for commands.

- **COMMAND_PREFIXES**: Optional string array. The prefixes required to trigger bot commands.

- **REQUIRE_SPACE_AFTER_PREFIX**: Optional boolean. Determines whether if a space is required after a prefix to trigger a command. e.g `! help` vs `!help`

.env file.
```
DISCORD_TOKEN=x
DEBUG_OUTPUT_CHANNELS=1234567890,0000000000
DEV_IDS=x,y,z
DATABASE_URI=x
CHATBOT_USER_ID=a
CHATBOT_API_KEY=b
CHATBOT_SESSION=c
```
Available options:
- **DISCORD_TOKEN**: Discord Token for the bot application.

- **DEBUG_OUTPUT_CHANNELS**: Comma separated Discord channel ID's to specify bot outputs logging.

- **DEV_IDS**: Comma separated discord user ID's who will be granted higher privileges. Used for bot development. 

- **DATABASE_URI**: URI for a database connection. Nikku will start in no database mode if the connection fails.

- **CHATBOT_USER_ID**: User ID for chatbot services.

- **CHATBOT_API_KEY**: API Key for chatbot services.

- **CHATBOT_SESSION**: Session ID for chatbot services.

### Creating your first command.
There are multiple ways to create a bot command. The most common way is to simply extend our command classes. Nikku provides classes such as `ExecutableCommand` to easily setup commands.

Simple example: `commands/Ping.js` responds with pong.
```
import { ExecutableCommand } from "nikku";

export class Ping extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "ping",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Responds with pong.",
        });
    }

    public setCustomAction() {
        return async (state) => {
            state.getHandle().channel.send("pong");
        };
    }
}
```
Now we will register this command using the `CommandImporter`. Using our example from before we will register the `/commands` folder as a command module. Nikku will search and automatically import all valid commands from a command module before loading the command for use.
```
import * as Nikku from "nikku";

const initializer = {
    configurationPath: "config.json",
};

const core = new Nikku.NikkuCore(initializer);

const importer = new Nikku.CommandImporter();
// Register the commands folder as a command module.
importer.registerPath("commands");

core.start();
```
Now invoke the command from Discord (e.g `!ping`) and your bot should respond with `pong`.

### Advanced commands

COMING SOON............

## Development

### Requirements
- Node 10 or higher.
- TypeScript 2.9.
- tslint is recommended for style consistency.

### Build
1. Clone or Fork the repository.
2. Install dependencies and packages.
3. Compile TypeScript.
4. Use built-in example (soon) or `npm link` to develop and test.

## Licence

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
