export class FortnightBotException extends Error {
    public message: string;
    constructor(message: string, stack?: string) {
        super(stack);
        this.message = message;
    }
}
