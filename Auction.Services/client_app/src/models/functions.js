import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function getUserFullName(userName, profile) {
    if (!profile?.firstName && !profile?.lastName) {
        return userName;
    }

    return `${profile?.firstName} ${profile?.lastName ?? ''}`.trim();
}

export function formatTimeRemaining(utcString) {
    const targetDate = parseISO(utcString);
    const timeLeft = formatDistanceToNow(targetDate, { addSuffix: true, locale: ru })
        .replace('через ', '')
        .replace('приблизительно ', '');

    return `${timeLeft} осталось`;
}

export function formatDate(utcDateString) {
    const date = parseISO(utcDateString);

    return format(date, "d MMMM yyyy, HH:mm", { locale: ru });
}