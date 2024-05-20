export function getUserFullName(userName, profile){
    if (!profile?.firstName && !profile?.lastName) {
        return userName;
    }

    return `${profile?.firstName} ${profile?.lastName}`.trim();
}

export function formatDate(utcDateString) {
    const date = new Date(utcDateString);
    
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()]; // Месяцы начинаются с 0
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}