export class Loop {
    private amount: number;
    private delay: number;
    private callback: (amount: number) => void;
    private interval: any;

    /**
     * @classdesc A base recursive loop class.
     * @param amount - Amount of times to loop.
     * @param delay - The delay between each loop.
     * @param callback - Recursive callback to iterate the loop.
     */
    constructor(amount: number, delay: number,
                callback: (amount: number) => void) {
        this.amount = amount;
        this.delay = delay;
        this.callback = callback;
        this.interval = null;
    }

    /**
     * Execute one cycle of the loop.
     * @param self - The previous iteration of the loop.
     */
    public loop(self: Loop): void {
        self.callback(self.amount);
        self.amount--;
        self.interval = setTimeout(self.loop, self.delay, self);
        if (self.amount < 1) {
            self.stopLoop();
        }
    }

    /**
     * Starts the loop.
     */
    public startLoop(): void {
        this.interval = setTimeout(this.loop, this.delay, this);
    }

    /**
     * Terminates the loop.
     */
    public stopLoop(): void {
        clearTimeout(this.interval);
    }
}
