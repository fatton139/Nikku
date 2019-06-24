import { NikkuException } from "Exception";

export class DatabaseException extends NikkuException {
    /**
     * @classdesc Exception thrown for database related errors.
     * @param message - Message associated with the error.
     */
    constructor(message: any) {
        super(message);
    }
}
