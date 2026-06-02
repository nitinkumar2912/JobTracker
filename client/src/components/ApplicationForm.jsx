import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { api, getApiError } from '../services/api';
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES, JOB_SOURCES, PRIORITIES, WORK_MODES } from '../utils/constants';
import { dateInputValue } from '../utils/formatters';

const blankForm = {
  company: '',
  role: '',
  jobUrl: '',
  source: 'LinkedIn',
  location: '',
  workMode: 'Hybrid',
  salaryMin: '',
  salaryMax: '',
  currency: 'INR',
  employmentType: 'Full-time',
  status: 'Saved',
  priority: 'Medium',
  appliedDate: '',
  followUpDate: '',
  contact: {
    name: '',
    email: '',
    linkedInOrPhone: ''
  },
  notes: '',
  tagsText: '',
  resumeVersion: '',
  resumeLink: '',
  coverLetterUsed: false,
  jobDescription: ''
};

const toFormState = (application) => {
  if (!application) return blankForm;
  return {
    ...blankForm,
    ...application,
    appliedDate: dateInputValue(application.appliedDate),
    followUpDate: dateInputValue(application.followUpDate),
    salaryMin: application.salaryMin ?? '',
    salaryMax: application.salaryMax ?? '',
    contact: {
      ...blankForm.contact,
      ...application.contact
    },
    tagsText: application.tags?.join(', ') || ''
  };
};

export const ApplicationForm = ({ initialData, onSubmit, submitLabel = 'Save application', isSubmitting = false }) => {
  const [form, setForm] = useState(() => toFormState(initialData));
  const [jobText, setJobText] = useState('');
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    setForm(toFormState(initialData));
  }, [initialData]);

  const canSubmit = useMemo(() => form.company.trim() && form.role.trim(), [form.company, form.role]);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const updateContact = (field, value) => {
    setForm((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value
      }
    }));
  };

  const handleExtract = async () => {
    if (jobText.trim().length < 20) {
      toast.error('Paste a little more of the job post first');
      return;
    }

    setExtracting(true);
    try {
      const { data } = await api.post('/applications/extract', { text: jobText });
      setForm((current) => ({
        ...current,
        ...Object.fromEntries(Object.entries(data.extracted).filter(([, value]) => value !== undefined && value !== '')),
        jobDescription: jobText
      }));
      toast.success('Extracted what I could from the job post');
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      tags: form.tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      salaryMin: form.salaryMin === '' ? null : Number(form.salaryMin),
      salaryMax: form.salaryMax === '' ? null : Number(form.salaryMax)
    };
    delete payload.tagsText;
    onSubmit(payload);
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <div className="section-heading">
          <h2>Core details</h2>
          <p>Role, company, source, status, and priority.</p>
        </div>
        <div className="form-grid">
          <label>
            Company name
            <input value={form.company} onChange={(event) => update('company', event.target.value)} required />
          </label>
          <label>
            Job title / role
            <input value={form.role} onChange={(event) => update('role', event.target.value)} required />
          </label>
          <label>
            Job post URL
            <input type="url" value={form.jobUrl} onChange={(event) => update('jobUrl', event.target.value)} />
          </label>
          <label>
            Source
            <select value={form.source} onChange={(event) => update('source', event.target.value)}>
              {JOB_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={(event) => update('status', event.target.value)}>
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={form.priority} onChange={(event) => update('priority', event.target.value)}>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h2>Compensation and logistics</h2>
          <p>Location, work mode, employment type, salary, and key dates.</p>
        </div>
        <div className="form-grid">
          <label>
            Location
            <input value={form.location} onChange={(event) => update('location', event.target.value)} />
          </label>
          <label>
            Work mode
            <select value={form.workMode} onChange={(event) => update('workMode', event.target.value)}>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>
          <label>
            Employment type
            <select value={form.employmentType} onChange={(event) => update('employmentType', event.target.value)}>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Currency
            <input value={form.currency} onChange={(event) => update('currency', event.target.value.toUpperCase())} />
          </label>
          <label>
            Salary min
            <input type="number" min="0" value={form.salaryMin} onChange={(event) => update('salaryMin', event.target.value)} />
          </label>
          <label>
            Salary max
            <input type="number" min="0" value={form.salaryMax} onChange={(event) => update('salaryMax', event.target.value)} />
          </label>
          <label>
            Applied date
            <input type="date" value={form.appliedDate} onChange={(event) => update('appliedDate', event.target.value)} />
          </label>
          <label>
            Follow-up date
            <input type="date" value={form.followUpDate} onChange={(event) => update('followUpDate', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h2>Recruiter and materials</h2>
          <p>Track who you spoke with and exactly which application assets you used.</p>
        </div>
        <div className="form-grid">
          <label>
            Recruiter/contact name
            <input value={form.contact.name} onChange={(event) => updateContact('name', event.target.value)} />
          </label>
          <label>
            Recruiter email
            <input type="email" value={form.contact.email} onChange={(event) => updateContact('email', event.target.value)} />
          </label>
          <label>
            Recruiter LinkedIn or phone
            <input value={form.contact.linkedInOrPhone} onChange={(event) => updateContact('linkedInOrPhone', event.target.value)} />
          </label>
          <label>
            Resume version used
            <input value={form.resumeVersion} onChange={(event) => update('resumeVersion', event.target.value)} />
          </label>
          <label>
            Resume link
            <input type="url" value={form.resumeLink} onChange={(event) => update('resumeLink', event.target.value)} />
          </label>
          <label>
            Tags
            <input value={form.tagsText} onChange={(event) => update('tagsText', event.target.value)} placeholder="frontend, referral, dream" />
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.coverLetterUsed} onChange={(event) => update('coverLetterUsed', event.target.checked)} />
            Cover letter used
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h2>Notes and quick extract</h2>
          <p>Keep raw context, interview prep, and job-post details close to the application.</p>
        </div>
        <div className="notes-grid">
          <label>
            Notes
            <textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} rows="8" />
          </label>
          <label>
            Paste job description
            <textarea value={jobText} onChange={(event) => setJobText(event.target.value)} rows="8" />
          </label>
        </div>
        <button className="btn btn-secondary" type="button" onClick={handleExtract} disabled={extracting}>
          <Sparkles size={16} />
          {extracting ? 'Extracting...' : 'Extract details'}
        </button>
      </section>

      <div className="form-footer">
        <button className="btn btn-primary" type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
