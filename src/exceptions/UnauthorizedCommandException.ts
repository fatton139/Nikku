import { FortniteBotException } from "./FortniteBotException";

export class UnauthorizedCommandException extends FortniteBotException {
    constructor(message: string) {
        super(message);
    }
}
