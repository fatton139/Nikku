import { FortniteBotException } from "./FortniteBotException";

export class UnauthorizedCommandException extends FortniteBotException {

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(message: string) {
        super(message);
    }
}
