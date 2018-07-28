import { FortniteBotException } from "./FortniteBotException";

export class DatabaseException extends FortniteBotException {
    /**
     * @classdesc Exception thrown for database related errors.
     * @param message - Message associated with the error.
     */
    constructor(message: any) {
        super(message);
    }
}
