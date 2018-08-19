# Fortnite Bot

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e12d96ca6dfd4a80a4063eb97cd24837)](https://app.codacy.com/app/aXises/fortniteBot?utm_source=github.com&utm_medium=referral&utm_content=aXises/fortniteBot&utm_campaign=badger)
![CodeFactor](https://www.codefactor.io/repository/github/axises/fortnitebot/badge) [![codecov](https://codecov.io/gh/aXises/fortniteBot/branch/master/graph/badge.svg)](https://codecov.io/gh/aXises/fortniteBot)
[![Maintainability](https://api.codeclimate.com/v1/badges/51cbd263ff1f0afff332/maintainability)](https://codeclimate.com/github/aXises/fortniteBot/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/51cbd263ff1f0afff332/test_coverage)](https://codeclimate.com/github/aXises/fortniteBot/test_coverage)

A bot which pings selected targets whenever fortnite is mentioned. Use at your own risk. Despite its name, the main focus of the bot is to provide a flexible command system so that fun commands can be easily added to provide entertaining interactions between users and the bot.

## Requirements
- Node 6 or higher
- TypeScript 2
- tslint is recommended for style consistency

## Build
Clone the repository `git clone https://github.com/aXises/fortniteBot`

Install required packages `npm install`

Install TypeScript `npm install -g typescript`

Nodemon is recommended `npm install -g nodemon`

Compile TypeScript `tsc`

Configure API keys in fortniteBot.ts or with .env file

Running the application `node fortniteBot.js` or `nodemon fortniteBot.js`

## Creating commands
It is recommended to place these in a seperate file.
```
// MyCustomCommands.ts
// Examples to demonstrate adding different types of commands.
import * as Discord from "discord.js";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { ExecutableCommand } from "../command/ExecutableCommand";
import { AutoTriggerCommand } from "../command/AutoTriggerCommand";
import { FortniteBotTrigger } from "../action/FortniteBotTrigger";

// Example Executable Command.

// Example action. Takes 1 argument and sends it back to the channel.
const testCommandAction = new FortniteBotAction(1, (state, args) => {
    const m: Discord.Message = state.getHandle();
    if (args.length !== 1) {
        return false; // Command failed.
    }
    m.channel.send(args[0]);
    return true; // Command was successfully executed.
});

// To execute the command, call '!f testcommand'. Anyone with access level 0 can execute this command.
const testCommand = new ExecutableCommand("testcommand", 0, testCommandAction);

// Example Auto Trigger Command

// Example Triggers.
const trigger1 = new FortniteBotTrigger((state) => {
    return Math.random() > 0.5; // Action will be executed if true. (50%)
});

const trigger2 = new FortniteBotTrigger((state) => {
    const m: Discord.Message = state.getHandle();
    return m.content === "egg"; // Action will be executed whenever the message is "egg".
});

// Example Action for auto trigger.
const testAutoAction = new FortniteBotAction(1, (state) => {
    const m: Discord.Message = state.getHandle();
    m.channel.send("This action was triggered");
    return true;
});

// Set up the command with different triggers.
const autoCommand1 = new AutoTriggerCommand(0, testAutoAction, trigger1);
const autoCommand2 = new AutoTriggerCommand(0, testAutoAction, trigger2);

// Export all the commands.
export const myCustomCommands = [testCommand, autoCommand1, autoCommand2];

// Import in to the command manager with CommandManager.addBulkCommand() or CommandManager.addCommand().
// See FortniteBotEventCore.ts for example.
```


## Commands
```
Standard Commands
!f - Asks your targets to play fortnite.
!f ping - Check for response.
!f help - Displays help message.
!f target @target - Adds target to the targetlist.
!f targetlist - Shows the current targets.
!f removeself - Removes yourself from the targetlist.
!f auto amount delay(s) - Automatically ping the targets a set amount of times with an delay.

User Commands
!f register - Registers yourself.
!f profile - Check your profile.
!f daily - Grab daily rewards.

Shop Commands
!f shoplist - Displays all available shops.
!f viewshop shopname - View a shop.
!f buy index/itemname from shopname - Buy an item from a shop.
...More coming soon.
```

## Contributing
All contribtions are welcome. Adhering to tslint style is recommended.

## Disclaimer
I do not play nor have any affiliation with Fortnite. This application is a simple tool to ~~spam~~ ask your friends/server members.
