export const truncate = (input) => {
    const openBracketIndex = input.indexOf('(');
    return openBracketIndex === -1 ? input : input.slice(0, openBracketIndex - 1);
};
