// // MyCustomCommands.ts
// // Examples to demonstrate adding different types of commands.
// import * as Discord from "discord.js";
// import { FortniteBotAction } from "../action/Action";
// import { ExecutableCommand } from "../command/ExecutableCommand";
// import { AutoTriggerCommand } from "./TriggerableCommand";
// import { FortniteBotTrigger } from "../action/Trigger";

// // Example Executable Command.

// // Example action. Takes 1 argument and sends it back to the channel.
// const testCommandAction = new FortniteBotAction(1, (state, args) => {
//     const m: Discord.Message = state.getHandle();
//     if (args.length !== 1) {
//         return false; // Command failed.
//     }
//     m.channel.send(args[0]);
//     return true; // Command was successfully executed.
// });

// // To execute the command, call '!f testcommand'. Anyone with access level 0 can execute this command.
// const testCommand = new ExecutableCommand("testcommand", 0, testCommandAction);

// // Example Auto Trigger Command

// // Example Triggers.
// const trigger1 = new FortniteBotTrigger((state) => {
//     return Math.random() > 0.5; // Action will be executed if true. (50%)
// });

// const trigger2 = new FortniteBotTrigger((state) => {
//     const m: Discord.Message = state.getHandle();
//     return m.content === "egg"; // Action will be executed whenever the message is "egg".
// });

// // Example Action for auto trigger.
// const testAutoAction = new FortniteBotAction(1, (state) => {
//     const m: Discord.Message = state.getHandle();
//     m.channel.send("This action was triggered");
//     return true;
// });

// // Set up the command with different triggers.
// const autoCommand1 = new AutoTriggerCommand(0, testAutoAction, trigger1);
// const autoCommand2 = new AutoTriggerCommand(0, testAutoAction, trigger2);

// // Export all the commands.
// export const myCustomCommands = [testCommand, autoCommand1, autoCommand2];

// // Import in to the command manager with CommandManager.addBulkCommand() or CommandManager.addCommand().
// // See FortniteBotEventCore.ts for example.
