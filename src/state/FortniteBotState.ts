export class FortniteBotState {
    public handle: object;
    constructor(handle: object) {
        this.handle = handle;
    }
    public setHandle(handle: object): void {
        this.handle = handle;
    }
    public getHandle(): object {
        return this.handle;
    }
}
