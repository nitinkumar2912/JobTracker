import { differenceInCalendarDays, format, isBefore, parseISO } from 'date-fns';

export const formatDate = (date, fallback = 'Not set') => {
  if (!date) return fallback;
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatShortDate = (date) => {
  if (!date) return 'No date';
  return format(new Date(date), 'MMM d');
};

export const dateInputValue = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatCurrencyRange = (application) => {
  const { salaryMin, salaryMax, currency = 'INR' } = application;
  if (!salaryMin && !salaryMax) return 'Not disclosed';

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  });

  if (salaryMin && salaryMax) return `${formatter.format(salaryMin)} - ${formatter.format(salaryMax)}`;
  return formatter.format(salaryMin || salaryMax);
};

export const isOverdue = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(parseISO(String(date)), today);
};

export const daysUntil = (date) => {
  if (!date) return null;
  return differenceInCalendarDays(new Date(date), new Date());
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'JT';

export const commaList = (value) => {
  if (!value?.length) return 'None';
  return value.join(', ');
};
