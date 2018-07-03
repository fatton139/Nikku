export class Loop {
    private amount: number;
    private delay: number;
    private callback: (amount: number) => void;
    private interval: any;
    constructor(amount: number, delay: number,
                callback: (amount: number) => void) {
        this.amount = amount;
        this.delay = delay;
        this.callback = callback;
        this.interval = null;
    }
    public loop(self: Loop): void {
        self.callback(self.amount);
        self.amount--;
        self.interval = setTimeout(self.loop, self.delay, self);
        if (self.amount < 1) {
            self.stopLoop();
        }
    }
    public startLoop(): void {
        this.interval = setTimeout(this.loop, this.delay, this);
    }
    public stopLoop(): void {
        clearTimeout(this.interval);
    }
}
