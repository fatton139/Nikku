"use strict";
let Discord = require("discord.js");
let moment = require("moment");
let Chatbot = require("cleverbot.io");
let request = require("request");
let momentDuration = require("moment-duration-format");
const authToken = process.env.token;
const chatApi = process.env.chatKey;
let bot = new Discord.Client();
let targets = ["<@132448673710866432>"];
let loop;
let chatBot = new Chatbot(process.env.APIUser, process.env.APIKey);
chatBot.setNick("KYkUKga0");

let randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
};

bot.on('message', (message) => {
    class Loop {
        constructor(amount, delay) {
            this.amount = amount;
            this.delay = delay;
            this.interval = null;
        }
        sendMessage () {
            if (this.amount <= 1) {
                message.channel.send(getTargetString(targets) + " fortnite?")
                    .then((message) => {
                    message.delete(3600000);
                });
                return;
            }
            message.channel.send(getTargetString(targets) + " fortnite? " + 
                (this.amount - 1) + " left").then((message) => {
                message.delete(3600000);
            });
        }
        loop(self) {
            self.sendMessage();
            self.amount--;
            self.interval = setTimeout(self.loop, self.delay, self);
            if (self.amount < 1) {
                self.stopLoop();
            }
        }
        startLoop() {
            this.interval = setTimeout(this.loop, this.delay, this);
        }
        stopLoop() {
            clearTimeout(this.interval);
        }
    }

    let getTargetString = (targets) => {
        let targetString = "";
        for (let i = 0; i < targets.length; i++) {
            targetString += i < targets.length - 1 ? 
                targets[i] + " " : targets[i];
        }
        return targetString;
    };

    let sendDefault = (del, tts) => {
        message.channel.send(getTargetString(targets) + " fortnite?", {
            tts: tts
        }).then((message) => {
            if (del)
                message.delete(3600000);
        });
    };

    let messageStyles = [
        "OwO someone said fortnite? " + getTargetString(targets) + " fortnite?",
        "AwoooooOOoo someone said fortnite? " + getTargetString(targets) + 
            " fortnite?",
        "Someone said fortnite :3 " + getTargetString(targets) + " fortnite?",
        "Fortnite? " + getTargetString(targets) + " fortnite?",
        "How do I draw triangles with vector transforms? " + 
            getTargetString(targets) + " fortnite?",
        "Its..its not like I wan...want to play fortnite with " + 
            getTargetString(targets) + " or anything >///<",
        "Notices fortnite, Owo whats this? " + getTargetString(targets) + 
            " fortnite?",
        "Brad said to play fortnite." + getTargetString(targets) + " fortnite?",
        "Nick said to play fortnite." + getTargetString(targets) + " fortnite?",
        "Patty said to play fortnite." + getTargetString(targets) +
            " fortnite?",
        "Alex said to play fortnite." + getTargetString(targets) + " fortnite?",
        "JZ said to play fortnite." + getTargetString(targets) + " fortnite?",
    ];

    if (Math.random() < 0.025) {
        if (Math.random < 0.5) {
            chatBot.create((err, session) => {
                chatBot.ask(message.content, (err, res) => {
                    let response = res + " " + messageStyles[randInt(0, 
                        messageStyles.length - 1)];
                    message.channel.send(response).then((message) => {
                        message.delete(3600000);
                    });
                });
            });
        } else {
            request("https://talaikis.com/api/quotes/random/", 
                (err, res, body) => {
                let quoteRes = JSON.parse(body);
                let style = messageStyles[randInt(0, messageStyles.length - 1)];
                let response;
                if (quoteRes.quote.substr(quoteRes.quote.length - 1) == ".")
                    response = quoteRes.author + " said - " + quoteRes.quote
                        .slice(0, quoteRes.quote.length - 1) +
                        " and " + style.substr(0, 1).toLowerCase() +
                        style.substr(1);
                response = quoteRes.author + " said - " + quoteRes.quote +
                    style;
                message.channel.send(response).then((message) => {
                    message.delete(3600000);
                });
            });
        }
    }

    if (message.content.replace(/\s/g, '').toLowerCase().search("pubg") != -1 &&
         !message.author.bot && message.content[0] != "!") {
        message.channel.send("PUBG aka PlayerUnknown's Battle Grounds is " +
            "trash, Fortnite is better ^__^ " + getTargetString(targets) + 
            " fortnite?").then((message) => {
                message.delete(3600000);
        });
    }

    if ((message.content.replace(/\s/g, '').toLowerCase().search("fortnite") != 
        -1) && (!message.author.bot && message.content[0] != "!")) {
        let response = messageStyles[randInt(0, messageStyles.length - 1)];
        message.channel.send(response).then((message) => {
            message.delete(3600000);
        });
    }
    
    if (message.content.startsWith("!fortnite")) {
        let args = message.content.split(" ");
        let command = args[1];
        if (!command) {
            sendDefault(false, false);
        }
        else if (command == "tts") {
            sendDefault(true, true);
        }
        else if (command == "auto") {
            let time = args[3];
            if (!args[3] || args[3] < 1000) {
                message.reply("pls no").then((message) => {
                    message.delete(3600000);
                });
                return;
            }
            let amount = args[2];
            loop = new Loop(parseInt(amount), parseInt(time));
            loop.startLoop();
            let formattedTime = moment.duration(parseInt(time), "milliseconds")
                .format();
            message.channel.send("Auto fortnite set. I will ping " +
                getTargetString(targets) + " once every " + formattedTime +
                " for " + amount + " times").then((message) => {
                message.delete(3600000);
            });

        }
        else if (command == "stop") {
            loop.stopLoop();
        }
        else if (command == "target") {
            if (targets)
                targets = args.splice(2);
                message.channel.send("New targets set, don't be mad " +
                    getTargetString(targets));
        }
        else if (command == "delete") {
            message.channel.fetchMessages({limit: parseInt(args[2])})
                .then((messages) => {
                let selfMessages = messages.filter((messages) =>
                    (messages.author.bot));
                let amount = selfMessages.array().length;
                message.channel.bulkDelete(selfMessages);
                message.channel.send("Deleted " + amount + " messages ^__^ " +
                    getTargetString(targets) + " wanna play fortnite?");
            });
        }
        else if (command == "help") {
            message.channel.send("```OwO u wan halp?\n" +
            "!fortnite - Asks your targets to play fortnite. >///<\n" +
            "!fortnite tts - Asks your targets to play fortnite but more " +
                " nicely. >/////<\n" +
            "!fortnite target {@target1} {@target2} ... {@targetn} - Set new " +
                " targets/friends :3\n" +
            "!fortnite auto {amount} {delay(ms)} - Ask your friends many " +
                " many manie times\n" +
            "!fortnite delete - Removes my nice messages ლ(´ڡ`ლ)\n" +
            "!fortnite stop - stops any pings caused by !fortnite auto " +
                " (may be delayed) ᕙ(⇀‸↼‶)ᕗ" +
            "```"
            );
        }
        else {
            message.reply("no").then((message) => {
                message.delete(3600000);
            });
        }
    }
});

bot.login(authToken);
bot.on("ready", () => {
    bot.user.setGame("PLAYERUNKNOWN'S BATTLEGROUNDS",
        "https://www.twitch.tv/yaxises");
});