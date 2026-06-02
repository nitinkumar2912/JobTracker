const csvEscape = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
};

export const applicationsToCsv = (applications) => {
  const columns = [
    ['Company', 'company'],
    ['Role', 'role'],
    ['Status', 'status'],
    ['Priority', 'priority'],
    ['Source', 'source'],
    ['Location', 'location'],
    ['Work Mode', 'workMode'],
    ['Employment Type', 'employmentType'],
    ['Salary Min', 'salaryMin'],
    ['Salary Max', 'salaryMax'],
    ['Currency', 'currency'],
    ['Applied Date', 'appliedDate'],
    ['Follow-up Date', 'followUpDate'],
    ['Recruiter Name', 'contact.name'],
    ['Recruiter Email', 'contact.email'],
    ['Recruiter LinkedIn or Phone', 'contact.linkedInOrPhone'],
    ['Resume Version', 'resumeVersion'],
    ['Cover Letter Used', 'coverLetterUsed'],
    ['Tags', 'tags'],
    ['Job URL', 'jobUrl'],
    ['Notes', 'notes'],
    ['Created At', 'createdAt'],
    ['Updated At', 'updatedAt']
  ];

  const read = (item, path) => path.split('.').reduce((acc, key) => acc?.[key], item);
  const header = columns.map(([label]) => csvEscape(label)).join(',');
  const rows = applications.map((application) =>
    columns
      .map(([, key]) => {
        const value = read(application, key);
        if (value instanceof Date) return csvEscape(value.toISOString());
        return csvEscape(value);
      })
      .join(',')
  );

  return [header, ...rows].join('\n');
};
