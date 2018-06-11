import { FortnightBotException } from "./FortnightBotException";

export class UnauthorizedCommandException extends FortnightBotException {
    constructor(message: string) {
        super(message);
    }
}
