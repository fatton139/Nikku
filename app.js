"use strict";
var Discord = require("discord.js");
var moment = require("moment");
var momentDuration = require("moment-duration-format");
const authToken = "NDM3MTU1NDM1ODA0MzYwNzE0.DbyAfA.OmAW7R9t-342ic_QjMeQR2JYYoc";
var bot = new Discord.Client();
var targets = ["<@121959865101975552>"];

bot.on('message', (message) => {
    
    var getTargetString = (targets) => {
        var targetString = "";
        for (var i = 0; i < targets.length; i++) {
            if (i < targets.length - 1)
                targetString += targets[i] + " ";
            else
                targetString += targets[i];
        }
        return targetString;
    };

    var sendDefault = (del, tts) => {
        message.channel.send(getTargetString(targets) + " fortnite?", {
            tts: tts
        }).then((message) => {
            if (del)
                message.delete(86400000);
        });
    };

    var loop = (amount, delay) => {
        var i = 0;
        function selfLoop () {
            setTimeout(function () {
                sendDefault(true, false);
                i++;
                if (i < amount) {
                   selfLoop();
                }
             }, delay);
        }
        selfLoop();
    };
    
    if ((message.content.replace(/\s/g, '').search("fortnite") != -1 && !message.author.bot && message.content[0] != "!") || Math.random() < 0.05) {
        message.channel.send("OwO someone said fortnite? " + getTargetString(targets) + " fortnite?").then((message) => {
                message.delete(86400000);
        });
    }
    
    if (message.content.startsWith("!fortnite")) {
        var args = message.content.split(" ");
        var command = args[1];
        if (!command) {
            sendDefault(false, false);
        }
        else if (command == "tts") {
            sendDefault(true, true);
        }
        else if (command == "auto") {
            var amount = args[2];
            var time = args[3];
            loop(parseInt(amount), parseInt(time));
            var formattedTime = moment.duration(parseInt(time), "milliseconds").format();
            message.channel.send("Auto fortnite set. I will ping " + getTargetString(targets) + " once every " + formattedTime + " for " + amount + " times").then((message) => {
                message.delete(86400000);
            });
        }
        else if (command == "target") {
            if (targets)
                targets = args.splice(2);
                message.channel.send("New targets set, don't be mad " + getTargetString(args.splice(2)));
        }
        else if (command == "delete") {
            message.channel.fetchMessages({limit: parseInt(args[2])}).then((messages) => {
                var selfMessages = messages.filter((messages) => (messages.author.bot));
                var amount = selfMessages.array().length;
                message.channel.bulkDelete(selfMessages);
                message.channel.send("Deleted " + amount + " messages ^__^ " + getTargetString(targets) + " wanna play fortnite?");
            });
        }
        else if (command == "help") {
            message.channel.send("```OwO u wan halp?\n"
            + "!fortnite - Asks your targets to play fortnite. >///<\n"
            + "!fortnite tts - Asks your targets to play fortnite but more nicely. >/////<\n"
            + "!fortnite target {@target1} {@target2} ... {@targetn} - Set new targets/friends :3\n"
            + "!fortnite auto {amount} {delay(ms)} - Ask your friends many many manie times\n"
            + "!fortnite delete - Removes my nice messages ლ(´ڡ`ლ)"
            + "```"
            );
        }
        else {
            message.reply("no").then((message) => {
                message.delete(86400000);
            });
        }
    }
});

bot.login(authToken);
bot.on("ready", () => {
    bot.user.setGame("PLAYERUNKNOWN'S BATTLEGROUNDS", "https://www.twitch.tv/yaxises");
});