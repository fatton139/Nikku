export class NikkuException extends Error {

    /**
     * @classdesc Base custom exception class.
     * @param message - Message associated with the error.
     * @param stack - Stack associated with the error.
     */
    constructor(message?: string, stack?: string) {
        super(stack);
        this.message = message ? message : "No error message specified.";
    }

    public set message(message: string) {
        this.message = message;
    }

    public get message(): string {
        return this.message;
    }
}
