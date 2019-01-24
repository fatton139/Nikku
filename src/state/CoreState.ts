import NikkuCore from "core/NikkuCore";
import { ICoreState } from "./ICoreState";
import * as Discord from "discord.js";
import DatabaseCore from "core/DatabaseCore";
import CommandManager from "managers/CommandManager";

export default class CoreState<T> implements ICoreState<T> {
    /**
     * Hander for the state.
     */
    protected handle?: T;

    protected core: NikkuCore;

    /**
     * @classdesc Base state for the bot.
     * @param handle - Handler for the state.
     */
    constructor(core: NikkuCore) {
        this.core = core;
    }

    /**
     * Sets the handle of the state.
     * @param handle - New handle to set.
     */
    public setHandle(handle: T): void {
        this.handle = handle;
    }

    /**
     * Gets the current handle.
     */
    public getHandle(): T {
        return this.handle;
    }

    public getCore(): NikkuCore {
        return this.core;
    }
}
