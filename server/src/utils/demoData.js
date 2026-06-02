const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const demoUser = {
  name: 'Aarav Sharma',
  email: 'demo@jobtrack.dev',
  password: 'DemoPass123!',
  headline: 'Full-stack developer focused on product engineering',
  location: 'Bengaluru, India',
  portfolioUrl: 'https://aarav.dev',
  linkedInUrl: 'https://linkedin.com/in/aarav-demo',
  githubUrl: 'https://github.com/aarav-demo',
  resumeUrl: 'https://drive.google.com/demo-resume',
  targetRoles: ['Software Engineer', 'Frontend Engineer', 'Full-stack Developer'],
  preferredLocations: ['Bengaluru', 'Remote', 'Pune']
};

export const buildDemoApplications = () => [
  {
    company: 'Atlassian',
    role: 'Frontend Engineer Intern',
    jobUrl: 'https://www.atlassian.com/company/careers',
    source: 'Company Website',
    location: 'Remote India',
    workMode: 'Remote',
    salaryMin: 90000,
    salaryMax: 120000,
    currency: 'INR',
    employmentType: 'Internship',
    status: 'Interview Scheduled',
    priority: 'Dream',
    appliedDate: daysAgo(7),
    followUpDate: daysFromNow(1),
    contact: {
      name: 'Meera Iyer',
      email: 'meera.recruiting@example.com',
      linkedInOrPhone: 'linkedin.com/in/meera-demo'
    },
    notes: 'Hiring manager screen scheduled. Re-read frontend system design notes and prepare examples around accessibility.',
    tags: ['frontend', 'remote', 'design-systems'],
    resumeVersion: 'Frontend Resume v4',
    resumeLink: 'https://drive.google.com/demo-frontend-resume',
    coverLetterUsed: true,
    interviewNotes: [
      {
        title: 'Recruiter screen',
        type: 'Recruiter',
        date: daysAgo(3),
        summary: 'Talked through internship timeline, React experience, and product taste. Recruiter emphasized component architecture.',
        outcome: 'Moved to hiring manager round'
      }
    ],
    interviewRounds: [
      {
        stage: 'Recruiter Screen',
        interviewer: 'Meera Iyer',
        date: daysAgo(3),
        result: 'Passed',
        notes: 'Clear next step with hiring manager.'
      }
    ],
    tasks: [
      { label: 'Review React performance patterns', done: false, dueDate: daysFromNow(1) },
      { label: 'Prepare three product-engineering stories', done: true, dueDate: daysAgo(1) }
    ]
  },
  {
    company: 'Razorpay',
    role: 'Software Engineer - Payments',
    jobUrl: 'https://razorpay.com/jobs',
    source: 'Referral',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    salaryMin: 1800000,
    salaryMax: 2400000,
    currency: 'INR',
    employmentType: 'Full-time',
    status: 'OA / Assessment',
    priority: 'High',
    appliedDate: daysAgo(10),
    followUpDate: daysFromNow(3),
    contact: {
      name: 'Rohan Menon',
      email: 'rohan@example.com',
      linkedInOrPhone: '+91 90000 00000'
    },
    notes: 'Referral submitted by college alum. OA is expected to cover data structures and backend API design.',
    tags: ['backend', 'payments', 'referral'],
    resumeVersion: 'Backend Resume v2',
    coverLetterUsed: false,
    tasks: [
      { label: 'Finish graph problems set', done: false, dueDate: daysFromNow(2) },
      { label: 'Revise idempotency and webhooks', done: false, dueDate: daysFromNow(3) }
    ]
  },
  {
    company: 'Swiggy',
    role: 'Associate Software Development Engineer',
    jobUrl: 'https://careers.swiggy.com',
    source: 'LinkedIn',
    location: 'Bengaluru',
    workMode: 'Onsite',
    salaryMin: 1400000,
    salaryMax: 1900000,
    currency: 'INR',
    employmentType: 'Full-time',
    status: 'Applied',
    priority: 'Medium',
    appliedDate: daysAgo(4),
    followUpDate: daysFromNow(5),
    contact: {
      name: '',
      email: '',
      linkedInOrPhone: ''
    },
    notes: 'Role focuses on order lifecycle reliability. Tailored resume around MERN and distributed systems coursework.',
    tags: ['full-stack', 'platform'],
    resumeVersion: 'Fullstack Resume v5',
    coverLetterUsed: false
  },
  {
    company: 'CRED',
    role: 'Frontend Engineer',
    jobUrl: 'https://cred.club/careers',
    source: 'Wellfound',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    salaryMin: 2000000,
    salaryMax: 2800000,
    currency: 'INR',
    employmentType: 'Full-time',
    status: 'Final Round',
    priority: 'Dream',
    appliedDate: daysAgo(21),
    followUpDate: daysAgo(1),
    contact: {
      name: 'Sneha Kapoor',
      email: 'sneha.recruiting@example.com',
      linkedInOrPhone: 'linkedin.com/in/sneha-demo'
    },
    notes: 'Final round was product-heavy. Need to send a short thank-you and reiterate interest.',
    tags: ['frontend', 'consumer', 'final-round'],
    resumeVersion: 'Frontend Resume v4',
    coverLetterUsed: true,
    interviewNotes: [
      {
        title: 'Technical deep dive',
        type: 'Technical',
        date: daysAgo(8),
        summary: 'Built a data table architecture and discussed render performance, optimistic updates, and error states.',
        outcome: 'Positive feedback'
      },
      {
        title: 'Product craft round',
        type: 'Product',
        date: daysAgo(2),
        summary: 'Discussed onboarding friction and measurable UX improvements for a rewards flow.',
        outcome: 'Awaiting decision'
      }
    ],
    interviewRounds: [
      {
        stage: 'Technical',
        interviewer: 'Staff FE Engineer',
        date: daysAgo(8),
        result: 'Passed',
        notes: 'Strong discussion on tradeoffs.'
      },
      {
        stage: 'Final Product Round',
        interviewer: 'Design Lead',
        date: daysAgo(2),
        result: 'Pending',
        notes: 'Follow up with thank-you note.'
      }
    ],
    tasks: [
      { label: 'Send final-round thank-you email', done: false, dueDate: daysAgo(1) }
    ]
  },
  {
    company: 'Freshworks',
    role: 'Software Engineer',
    jobUrl: 'https://freshworks.com/company/careers',
    source: 'Naukri',
    location: 'Chennai',
    workMode: 'Hybrid',
    salaryMin: 1200000,
    salaryMax: 1700000,
    currency: 'INR',
    employmentType: 'Full-time',
    status: 'Offer',
    priority: 'High',
    appliedDate: daysAgo(35),
    followUpDate: daysFromNow(6),
    contact: {
      name: 'Ananya Rao',
      email: 'ananya.hr@example.com',
      linkedInOrPhone: '+91 91111 11111'
    },
    notes: 'Offer received. Compare compensation, location, and learning opportunities with other active processes.',
    tags: ['offer', 'saas'],
    resumeVersion: 'Fullstack Resume v4',
    coverLetterUsed: true,
    tasks: [
      { label: 'Review offer details', done: true, dueDate: daysAgo(2) },
      { label: 'Ask about joining date flexibility', done: false, dueDate: daysFromNow(2) }
    ]
  },
  {
    company: 'Zerodha',
    role: 'Backend Engineer',
    jobUrl: 'https://zerodha.com/careers',
    source: 'Company Website',
    location: 'Remote India',
    workMode: 'Remote',
    salaryMin: 1700000,
    salaryMax: 2300000,
    currency: 'INR',
    employmentType: 'Full-time',
    status: 'Rejected',
    priority: 'High',
    appliedDate: daysAgo(45),
    followUpDate: daysAgo(30),
    contact: {
      name: '',
      email: 'careers@example.com',
      linkedInOrPhone: ''
    },
    notes: 'Rejected after backend assignment. Useful feedback: improve test coverage and explain indexing choices better.',
    tags: ['backend', 'fintech', 'learning'],
    resumeVersion: 'Backend Resume v1',
    coverLetterUsed: false,
    interviewNotes: [
      {
        title: 'Take-home retrospective',
        type: 'Self review',
        date: daysAgo(31),
        summary: 'Need tighter README, stronger integration tests, and clearer tradeoff section.',
        outcome: 'Action items added'
      }
    ]
  },
  {
    company: 'Postman',
    role: 'Developer Tools Intern',
    jobUrl: 'https://www.postman.com/company/careers',
    source: 'LinkedIn',
    location: 'Remote',
    workMode: 'Remote',
    salaryMin: 100000,
    salaryMax: 150000,
    currency: 'INR',
    employmentType: 'Internship',
    status: 'Saved',
    priority: 'Dream',
    followUpDate: daysFromNow(4),
    contact: {
      name: '',
      email: '',
      linkedInOrPhone: ''
    },
    notes: 'Need to tailor resume around API tooling projects before applying.',
    tags: ['developer-tools', 'api', 'internship'],
    resumeVersion: 'Developer Tools Resume draft',
    coverLetterUsed: false,
    tasks: [
      { label: 'Add API testing project to resume', done: false, dueDate: daysFromNow(2) }
    ]
  },
  {
    company: 'Groww',
    role: 'Full Stack Engineer',
    jobUrl: 'https://groww.in/careers',
    source: 'Other',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    salaryMin: 1600000,
    salaryMax: 2200000,
    currency: 'INR',
    employmentType: 'Full-time',
    status: 'On Hold',
    priority: 'Medium',
    appliedDate: daysAgo(18),
    followUpDate: daysFromNow(8),
    contact: {
      name: 'Talent Team',
      email: 'talent@example.com',
      linkedInOrPhone: ''
    },
    notes: 'Hiring paused for this team. Recruiter said to check again next month.',
    tags: ['fintech', 'full-stack'],
    resumeVersion: 'Fullstack Resume v5',
    coverLetterUsed: false
  }
];
