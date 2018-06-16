import { FortniteBotException } from "./FortniteBotException";

export class DatabaseException extends FortniteBotException {
    constructor(message: any) {
        super(message);
    }
}
