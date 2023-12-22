export const deepCopy = <T>(val: T): T => JSON.parse(JSON.stringify(val));
