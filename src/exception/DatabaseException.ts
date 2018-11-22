import NikkuException from "./NikkuException";

export class DatabaseException extends NikkuException {
    /**
     * @classdesc Exception thrown for database related errors.
     * @param message - Message associated with the error.
     */
    constructor(message: any) {
        super(message);
    }
}
