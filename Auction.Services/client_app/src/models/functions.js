import { formatDistanceToNow, parseISO, format } from 'date-fns';

export function getUserFullName(userName, profile){
    if (!profile?.firstName && !profile?.lastName) {
        return userName;
    }

    return `${profile?.firstName} ${profile?.lastName ?? ''}`.trim();
}

export function formatTimeRemaining(utcString) {
    const targetDate = parseISO(utcString);
    const timeLeft = formatDistanceToNow(targetDate, { addSuffix: true }).replace('in ', '').replace('about ', '');

    return `${timeLeft} left`;
}
export function formatDate(utcDateString) {
    const date = parseISO(utcDateString);

    return format(date, "d MMMM yyyy, HH:mm", { locale: undefined });
}