"use strict";
var Discord = require("discord.js");
var moment = require("moment");
var momentDuration = require("moment-duration-format");
const authToken = "NDM3MTU1NDM1ODA0MzYwNzE0.DbyAfA.OmAW7R9t-342ic_QjMeQR2JYYoc";
var bot = new Discord.Client();
var target = "<@121959865101975552>";

bot.on('message', (message) => {
    
    var sendDefault = (del, tts) => {
        message.channel.send("" + target + " fortnite?", {
            tts: tts
        }).then((message) => {
            if (del)
                message.delete(10000);
        });
    }

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
    
    if (message.content.search("fortnite") != -1 && !message.author.bot && message.content[0] != "!") {
        message.channel.send("someone said fortnite? " + target + " fortnite?");
    }
    
    if (message.content.startsWith("!fortnite")) {
        var command = message.content.split(" ")[1];
        if (!command) {
            sendDefault(false, false);
        }
        else if (command == "tts") {
            sendDefault(true, true);
        }
        else if (command == "auto") {
            var amount = message.content.split(" ")[2];
            var time = message.content.split(" ")[3];
            loop(parseInt(amount), parseInt(time));
            var formattedTime = moment.duration(parseInt(time), "milliseconds").format();
            message.channel.send("Auto fortnite set. I will ping " + target + "once every " + formattedTime + " for " + amount + " times").then((message) => {
                message.delete(30000);
            });
        }
        else if (command == "target") {
            if (target)
                target = message.content.split(" ")[2];
        }
        else {
            message.reply("usage: !fortnite auto {amount} {delay(ms)}").then((message) => {
                message.delete(10000);
            });
        }
    }
});

bot.login(authToken);
