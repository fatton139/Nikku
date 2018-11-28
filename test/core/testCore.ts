import "mocha";
import * as Discord from "discord.js";
import { expect } from "chai";
import NikkuCore from "core/NikkuCore";
import Config from "config/Config";
import ChannelTransport from "log/ChannelTransport";

describe("Nikku Core", () => {
    let core: NikkuCore;

    before(() => {
        core = new NikkuCore(Config);
    });

    it("Initializes correctly", () => {
        expect(core.getConfig()).to.be.equal(Config);
        expect(core.getClient()).to.be.not.equal(undefined);
        expect(core.getCoreState()).to.be.not.equal(undefined);
    });

    it("Initializes components correctly", () => {
        core.initializeComponents();
        expect(core.getEventCore()).to.be.not.equal(undefined);
        expect(core.getDbCore()).to.be.not.equal(undefined);
        expect(core.getCommandManager()).to.be.not.equal(undefined);
    });

    it("Sets debug logging channels correctly", () => {
        core.setDebugLogChannels();
        for (const channel of ChannelTransport.getChannels()) {
            expect(Config.Discord.DEBUG_CHANNELS).to.include(channel.id);
        }
    });
});
