import { core } from "core/NikkuCore";

export class CoreState {
    /**
     * Hander for the state.
     */
    public handle: any;

    /**
     * @classdesc Base state for the bot.
     * @param handle - Handler for the state.
     */
    constructor(handle: object) {
        this.handle = handle;
    }

    /**
     * Sets the handle of the state.
     * @param handle - New handle to set.
     */
    public setHandle(handle: object): void {
        this.handle = handle;
    }

    /**
     * Gets the current handle.
     */
    public getHandle(): any {
        return this.handle;
    }

    /**
     * Updates the current handle.
     */
    public updateHandle(): any {
        // Todo.
        return core.getCoreState().getHandle();
    }
}
