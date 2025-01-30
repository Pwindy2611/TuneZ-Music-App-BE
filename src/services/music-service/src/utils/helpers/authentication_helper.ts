
export const generateId = () => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${timestamp}${randomSuffix}`;
}
