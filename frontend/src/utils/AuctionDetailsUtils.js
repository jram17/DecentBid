const toTitleCase = (str) => {
    if (!str) {
        return '';
    }
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};

const getCreatedDates = (date) => {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return dateObj.toLocaleDateString('en-GB', options);
};

const IdUtils = (apartment_id) => {

    return `${apartment_id.slice(0, 5)}...${apartment_id.slice(-5)}`;
}


export { getCreatedDates, toTitleCase, IdUtils };