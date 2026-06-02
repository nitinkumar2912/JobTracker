export const APPLICATION_STATUSES = [
  'Saved',
  'Applied',
  'OA / Assessment',
  'Interview Scheduled',
  'Interviewing',
  'HR Round',
  'Final Round',
  'Offer',
  'Rejected',
  'On Hold'
];

export const JOB_SOURCES = [
  'LinkedIn',
  'Naukri',
  'Wellfound',
  'Referral',
  'Company Website',
  'Other'
];

export const WORK_MODES = ['Remote', 'Hybrid', 'Onsite'];

export const EMPLOYMENT_TYPES = [
  'Internship',
  'Full-time',
  'Part-time',
  'Contract'
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Dream'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'company', label: 'Company name' },
  { value: 'followUpDate', label: 'Follow-up date' },
  { value: 'appliedDate', label: 'Applied date' }
];

export const BOARD_COLUMNS = [
  {
    id: 'saved',
    title: 'Saved',
    status: 'Saved',
    statuses: ['Saved']
  },
  {
    id: 'applied',
    title: 'Applied',
    status: 'Applied',
    statuses: ['Applied']
  },
  {
    id: 'interview',
    title: 'Interview',
    status: 'Interviewing',
    statuses: ['OA / Assessment', 'Interview Scheduled', 'Interviewing', 'HR Round', 'Final Round']
  },
  {
    id: 'offer',
    title: 'Offer',
    status: 'Offer',
    statuses: ['Offer']
  },
  {
    id: 'rejected',
    title: 'Rejected',
    status: 'Rejected',
    statuses: ['Rejected', 'On Hold']
  }
];

export const STATUS_COLORS = {
  Saved: 'neutral',
  Applied: 'blue',
  'OA / Assessment': 'purple',
  'Interview Scheduled': 'amber',
  Interviewing: 'amber',
  'HR Round': 'teal',
  'Final Round': 'teal',
  Offer: 'green',
  Rejected: 'red',
  'On Hold': 'neutral'
};

export const PRIORITY_COLORS = {
  Low: 'neutral',
  Medium: 'blue',
  High: 'amber',
  Dream: 'purple'
};

export const CHART_COLORS = ['#2563eb', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b', '#22c55e'];
