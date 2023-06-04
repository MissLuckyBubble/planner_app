export const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) && parsedDate instanceof Date;
};

export const isValidHour = (hour) => {
    const hourRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return hourRegex.test(hour);
};

export const isNotEmpty = (text) => {
    return text !== '' && text !== null && text !== undefined;
};
