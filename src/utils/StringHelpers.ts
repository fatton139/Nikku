export namespace StringHelpers {
    export const removeFirstCharsNoSpace = (str: string, length: number): string => {
        let spaces = 0;
        for (let i = 0; i < length; i++) {
            if (str[i] === " ") {
                spaces++;
            }
        }
        return str.substring(length + spaces).trim();
    };

    export const removeLastCharsNoSpace = (str: string, length: number): string => {
        let spaces = 0;
        for (let i = 0; i < length; i++) {
            if (str[str.length - i - 1] === " ") {
                spaces++;
            }
        }
        return str.substring(0, str.length - (length + spaces)).trim();
    };

    export const removeStrBothEndsNoSpace = (str: string, removeString: string): string => {
        let newStr = str;
        if (newStr.replace(/\s/g, "").toLowerCase().startsWith(removeString)) {
            newStr = removeFirstCharsNoSpace(newStr, removeString.length);
        }
        if (newStr.replace(/\s/g, "").toLowerCase().endsWith(removeString)) {
            newStr = removeLastCharsNoSpace(newStr, removeString.length);
        }
        return newStr;
    };
}
