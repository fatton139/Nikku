# Fortnite Bot (Nikku 2)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e12d96ca6dfd4a80a4063eb97cd24837)](https://app.codacy.com/app/aXises/fortniteBot?utm_source=github.com&utm_medium=referral&utm_content=aXises/fortniteBot&utm_campaign=badger)
![CodeFactor](https://www.codefactor.io/repository/github/axises/fortnitebot/badge)
[![Maintainability](https://api.codeclimate.com/v1/badges/51cbd263ff1f0afff332/maintainability)](https://codeclimate.com/github/aXises/fortniteBot/maintainability) [![codecov](https://codecov.io/gh/aXises/fortniteBot/branch/master/graph/badge.svg)](https://codecov.io/gh/aXises/fortniteBot)
[![Test Coverage](https://api.codeclimate.com/v1/badges/51cbd263ff1f0afff332/test_coverage)](https://codeclimate.com/github/aXises/fortniteBot/test_coverage)

Mr Fortnite is an bot built upon the new Nikku 2 Core. Originally the main focus of the bot was to ping a group of (opt-in) users whenever "Fortnite" is mentioned.

Despite its name, the main focus of the bot is to provide a flexible command system so that complex commands can be quickly created, implemented and deployed.

## Features
- Currency
- User Profiles
- Targeting user for "Fortnite" pings
- Feeding Brad

## Upcoming
- User Skills
- Shop System
- Web User Interface
- VC Support
- More Activities
- Inventory
- Items
- Combat

## Contributing
All contributions are welcome. Adhering to tslint style is recommended.

## Getting Started

Want to try out Mr Fortnite? Invite it from **[right here](https://discordapp.com/api/oauth2/authorize?client_id=455679698610159616&permissions=0&scope=bot)**. This bot is still in development so commands may fail. Please submit a issue with the problem and the command which caused it.

## Development

Want to contribute or create your own build? Follow the following steps!

### Requirements
- Node 10 or higher.
- TypeScript 2.9.
- tslint is recommended for style consistency.

### Build
1. Clone or Fork the repository
2. Install dependencies and packages with `npm install`
3. Compile TypeScript with `tsc` (If you have global installation) or `npm run tsc`. For watch mode use `tsc -w` or `npm run tscw`.
4. Create a .env file in the project root with `touch .env` and configure it. See [Configuring .env file](#Configuring-the-env-file)
5. Run the application with `npm start`

### Configuring the .env file

A .env file can be setup with the following values:

Required. Discord Token for the bot application.
```
DISCORD_TOKEN=x
```

Optional. MongoDB URL for database options. Commands which require an database will be disabled should the connection fail.
```
DATABASE_URL=x
```

Optional. Comma separated discord user ID's who will be given the highest access level for commands. See [AccessLevel.ts](/src/user/AccessLevel.ts)
```
DEV_IDS=x,y,z
```

Optional. Comma separated channel ID's where debug logs will be sent to.
```
DEBUG_CHANNELS=x,y,z
```

Optional. Comma separated prefixes which are used to invoke commands.
```
PREFIXES=!f, !fortnite, &m
```

ChatBot Service keys. Should the following three keys be invalid, ChatBot Service will fail to initialize.

Optional. API Key for ChatBot.
```
CHATBOT_API_KEY=x
```
Optional. User ID for ChatBot.
```
CHATBOT_USER_ID=x
```

Optional. Session ID For ChatBot.
```
CHATBOT_SESSION=x
```

## Creating Commands

### Grouping Commands

Commands placed in the [modules](/src/command/modules) directory which is parsed by the [Command Manager](/src/command/CommandManager.ts) and loaded at runtime.

Commands are grouped by directories placed inside the modules directory, each directory name must be added to the COMMAND_PATHS array. Only the directory name need to be added, each file inside the registered directories will be parsed and attempt to be loaded as a command.

This is not setup as an environment variable since different builds may have different module paths setup. By tracking this variable we can reduce the amount of invalid paths as different builds arise.

Skip this step if your command can falls under existing groups.

Othewise find the following variable inside [Config.ts](/src/config/Config.ts) and add your module path (relative to src/commands/modules/) as needed.
```
public static readonly COMMAND_PATHS: string[] =
    [
        "mrfortnite",
        "util",
        "user",
        "brad",
        "interactions",
        "yourFilePath",
    ];
```

### Creating a Executable Command

Firstly create your command class and extend one of the existing command base classes.

Here we will extend the *ExecutableCommand* class which is the base for a command that is manually invoked by a user.

SampleCommand.ts
```
import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class SampleCommand extends ExecutableCommand {

}
```

Next we will setup the constructor.

The constructor super call contains the information required to run the command.
```
super(
    "sample",                   // The name of the command, we can invoke it with "prefix sample" e.g "!f sample"
    AccessLevel.UNREGISTERED,   // The access level of the user required to invoke this command.
    1,                          // The amount of argument required to run this command excluding the prefix and command name.
    "Sample command for demo.", // The description of this command. Used in the help command.
    "!f sample \"number\""      // Usage of this command. Will be sent to the user if wrong types or invalid argument length is passed.
);
```

Your command file should now look something like this.
```
import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class SampleCommand extends ExecutableCommand {
    public constructor() {
        super("sample", AccessLevel.UNREGISTERED, 1, "Sample command for demo.", "!f sample \"number\"");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            // What your command does will go here.
        });
    }
}
```

Finally we will setup what this command actually does. Specifically the "action" of the command.

The "action" of the command is a callback invoked when the command is called. Two arguments will be passed to the callback.

`state` - Contains the required data to interact with the discord API.

`args` - The arguments passed to the command, the array length will be equal to what is specified in the constructor. (Calling "!f sample arg1" will result in the array being ["arg1"]).

The return type is an boolean which determines whether if the command was successfully executed.
```
public setCustomAction(): Action {
    return new Action(async (state: OnMessageState, args: string[]): Promise<boolean> => {
        // What your command does will go here.
        return true;
    });
}
```

In this example we will send the first argument back to the user if it is a number.
```
public setCustomAction(): Action {
    return new Action(async (state: OnMessageState, args: string[]): Promise<boolean> => {
        if (isNaN(args[0])) {
            state.getMessageHandle().send("That's not a number!);
            return false; // Command failed.
        }
        state.getMessageHandle().send(args[0]);
        return true; // Command succeeded.
    });
}
```

The final file should look something like this.
```
import ExecutableCommand from "command/ExecutableCommand";
import { AccessLevel } from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

export default class SampleCommand extends ExecutableCommand {
    public constructor() {
        super("sample", AccessLevel.UNREGISTERED, 1, "Sample command for demo.", "!f sample \"number\"");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState, args: string[]): Promise<boolean> => {
            if (isNaN(args[0])) {
                state.getMessageHandle().channel.send("That's not a number!);
                return false; // Command failed.
            }
            state.getMessageHandle().send(args[0]);
            return true; // Command succeeded.
        });
    }
}
```

When we run the bot, we should see the logger display successful registration of the command.

`CommandRegistry:info:ExecutableCommand registered "sample".`

We can invoke the command in discord with `!prefix sample 1` and should see a response of `1`.

### Creating a Trigger Command

Coming soon.

## Licence

This project is lienced under the MIT Licence. See [LICENCE](LICENCE) for details.
