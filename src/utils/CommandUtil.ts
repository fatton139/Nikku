import { Config } from "config/NikkuConfig";
import { LevenshteinDistance } from "math/LevenshteinDistance";

export namespace CommandUtil {
    /**
     * Extracts the user id from a string.
     * @param text - The text to extract id from.
     */
    export const getId = (text: string): string => {
        return text.charAt(2) !== "!" ?
            text.slice(2, text.length - 1) : text.slice(3, text.length - 1);
    };

    export const isResponseTrigger = (message: string, tol: number): boolean => {
        const messageArr = message.split(" ");
        const triggerWord = Config.Command.BOT_RESPONSE_TRIGGER.replace(/\s/g, "").toLowerCase();
        for (let i = 1; i < messageArr.length; i++) {
            if (LevenshteinDistance((messageArr[i - 1] + messageArr[i]).toLowerCase(), triggerWord) <= tol) {
                return true;
            }
        }
        return false;
    };

}
