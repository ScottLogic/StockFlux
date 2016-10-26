export function truncate(input) {
    if (input) {
        const openBracketIndex = input.indexOf('(');
        if (openBracketIndex !== -1) {
            return input.slice(0, openBracketIndex - 1); // Also trim the space before the bracket
        }
    }
    return input;
}
