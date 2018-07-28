export class FortniteBotException extends Error {
    public message: string;

    /**
     * @classdesc Base custom exception class.
     * @param message - Message associated with the error.
     * @param stack - Stack associated with the error.
     */
    constructor(message: string, stack?: string) {
        super(stack);
        this.message = message;
    }
}
