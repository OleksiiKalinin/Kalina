const toLocalDate = (t) => {
    const date = new Date(t);
    const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    const temp = dateWithOffset.split('T');
    return {date: temp[0], time: temp[1].replace(/:\d+\..*$/g, '')}
};

export default toLocalDate;

// temp[0].replace(/^\d+-/g, '')