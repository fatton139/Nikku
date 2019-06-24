import "mocha";
import "chai/register-should";
import { expect } from "chai";
import { NikkuConfig } from "config";
import { NikkuException } from "exception"

describe("Nikku Configurations", () => {
    const configParser = NikkuConfig.configParser;
    it("Config parser initializes correctly", () => {
        (configParser.getBotConfig() as any).should.be.an("Object").that.is.empty;
        (configParser.getPackageJSONData() as any).should.be.an("Object").that.is.empty;
    });
    it("Parses bot configurations correctly", () => {
        configParser.parseConfig("test/config/testConfigA.json");
        const config = configParser.getBotConfig();
        expect(config.BOT_RESPONSE_TRIGGER).to.be.equal("test");
        expect(config.MODULE_PATHS).to.be.an("array").that.include.members(["patha", "pathb"]);
        expect(config.COMMAND_PREFIXES).to.be.an("array").that.include.members(["prefixa", "prefixb"]);
        expect(config.REQUIRE_SPACE_AFTER_PREFIX).to.be.an("boolean").that.is.true;
    });
    it("Throws an error on invalid trigger word", () => {
        expect(() => { configParser.parseConfig("test/config/invalidTriggerWord.json"); })
            .to.throw(NikkuException);
    });
    it("Defaults invalid fields to correct values", () => {
        configParser.parseConfig("test/config/badConfig.json");
        const config = configParser.getBotConfig();
        expect(config.BOT_RESPONSE_TRIGGER).to.be.equal("test");
        expect(config.MODULE_PATHS).to.be.an("Array").that.is.empty;
        expect(config.COMMAND_PREFIXES).to.be.an("Array").that.is.empty;
        expect(config.REQUIRE_SPACE_AFTER_PREFIX).to.be.an("Boolean").that.is.true;
    });
    it("Parses package.json correctly", () => {
        configParser.parsePackageJSON();
        const config = configParser.getPackageJSONData();
        expect(config.REPOSITORY).to.not.be.empty;
        expect(config.AUTHOR).to.not.be.empty;
        expect(config.VERSION).to.not.be.empty;
    });
});