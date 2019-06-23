import { NikkuCore } from "core";
import { ICoreState } from "./ICoreState";

export default class CoreState<T> implements ICoreState<T> {
    /**
     * Hander for the state.
     */
    protected handle: T;

    protected core: NikkuCore;

    /**
     * @classdesc Base state for the bot.
     * @param handle - Handler for the state.
     */
    constructor(core: NikkuCore, handle: T) {
        this.core = core;
        this.handle = handle;
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
