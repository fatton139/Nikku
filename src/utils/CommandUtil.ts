
/**
 * Extracts the user id from a string.
 * @param text - The text to extract id from.
 */
export const getId = (text: string): string => {
    return text.charAt(2) !== "!" ?
        text.slice(2, text.length - 1) : text.slice(3, text.length - 1);
};
