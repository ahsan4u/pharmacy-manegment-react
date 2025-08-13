export const limit = 10;

export function debouncer(fn, t) {
    let timeId;

    return async (...args) => {
        clearTimeout(timeId);
        timeId = setTimeout(async ()=> await fn(...args), t);
    }
}

export function priceAfterDiscount(price, discount) {
    if(!discount && price) return price;
    if(!price) return console.log('pirce and discount both are required');
    let temp = Math.ceil(price - (price * (discount/100)));

    if(isNaN(temp)) temp = null;
    return temp;
}

export function getRemainingDaysFromToday(date) {
    if (!date) return 0;
    const todayDate = new Date().setHours(0, 0, 0, 0);
    const givenDate = new Date(date).setHours(0, 0, 0, 0);
    const timeDiff = givenDate - todayDate;
    if (timeDiff <= 0) return 'Expire';
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return dayDiff;
}

export function getPrettyDate(dateStr) {
    if(!dateStr) return;

    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB').replaceAll('/', ' / ');
}

export function getDaysOff(dateStr) {
    if(!dateStr) return console.log('date now found');

    const givenDate = new Date(dateStr).setHours(0,0,0,0);;
    const currentDate = new Date().setHours(0,0,0,0);
    
    const timeDiff = currentDate - givenDate;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if(!timeDiff) return 'Today';
    if(timeDiff == 1) return 'Yesterday';

    return dayDiff;
}