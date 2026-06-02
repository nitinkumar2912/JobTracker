import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';
import { Application } from '../models/Application.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { applicationsToCsv } from '../utils/csv.js';

const allowedFields = [
  'company',
  'role',
  'jobUrl',
  'source',
  'location',
  'workMode',
  'salaryMin',
  'salaryMax',
  'currency',
  'employmentType',
  'status',
  'priority',
  'appliedDate',
  'followUpDate',
  'contact',
  'notes',
  'tags',
  'resumeVersion',
  'resumeLink',
  'coverLetterUsed',
  'jobDescription',
  'interviewRounds'
];

const finalStatuses = ['Offer', 'Rejected'];

const normalizePayload = (body) => {
  const payload = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) payload[field] = body[field];
  });

  ['salaryMin', 'salaryMax'].forEach((field) => {
    if (payload[field] === '') payload[field] = null;
  });

  ['appliedDate', 'followUpDate'].forEach((field) => {
    if (payload[field] === '') payload[field] = null;
  });

  if (typeof payload.tags === 'string') {
    payload.tags = payload.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return payload;
};

const getApplicationForUser = async (userId, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid application id', 400);
  }

  const application = await Application.findOne({ _id: id, user: userId });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  return application;
};

const buildListQuery = (req) => {
  const query = { user: req.user._id };
  const { search, status, source, priority, from, to } = req.query;

  if (search) {
    query.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) query.status = status;
  if (source) query.source = source;
  if (priority) query.priority = priority;

  if (from || to) {
    query.appliedDate = {};
    if (from) query.appliedDate.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      query.appliedDate.$lte = end;
    }
  }

  return query;
};

const sortMap = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  company: { company: 1, role: 1 },
  followUpDate: { followUpDate: 1, createdAt: -1 },
  appliedDate: { appliedDate: -1, createdAt: -1 }
};

export const listApplications = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const query = buildListQuery(req);
  const sort = sortMap[req.query.sort] || sortMap.newest;

  const [applications, total] = await Promise.all([
    Application.find(query).sort(sort).skip(skip).limit(limit),
    Application.countDocuments(query)
  ]);

  res.json({
    status: 'success',
    results: applications.length,
    page,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    applications
  });
});

export const createApplication = asyncHandler(async (req, res) => {
  const application = await Application.create({
    ...normalizePayload(req.body),
    user: req.user._id
  });

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'created',
    message: `Added ${application.role} at ${application.company}`,
    meta: {
      status: application.status,
      source: application.source
    }
  });

  res.status(201).json({
    status: 'success',
    application
  });
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);
  const activity = await Activity.find({
    user: req.user._id,
    application: application._id
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    status: 'success',
    application,
    activity
  });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);
  const previousStatus = application.status;
  const payload = normalizePayload(req.body);

  Object.entries(payload).forEach(([key, value]) => {
    application[key] = value;
  });

  await application.save();

  const statusChanged = payload.status && payload.status !== previousStatus;
  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: statusChanged ? 'status_changed' : 'updated',
    message: statusChanged
      ? `Moved ${application.company} from ${previousStatus} to ${application.status}`
      : `Updated ${application.role} at ${application.company}`,
    meta: statusChanged ? { from: previousStatus, to: application.status } : {}
  });

  res.json({
    status: 'success',
    application
  });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'deleted',
    message: `Deleted ${application.role} at ${application.company}`,
    meta: {
      company: application.company,
      role: application.role
    }
  });

  await application.deleteOne();

  res.status(204).send();
});

export const addInterviewNote = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);
  application.interviewNotes.push({
    title: req.body.title,
    type: req.body.type || 'Interview',
    date: req.body.date || new Date(),
    summary: req.body.summary,
    outcome: req.body.outcome || ''
  });

  await application.save();

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'note_added',
    message: `Added interview note for ${application.company}`,
    meta: {
      title: req.body.title
    }
  });

  res.status(201).json({
    status: 'success',
    application
  });
});

export const addTask = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);
  application.tasks.push({
    label: req.body.label,
    dueDate: req.body.dueDate || undefined
  });

  await application.save();

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'task_added',
    message: `Added task for ${application.company}`,
    meta: {
      label: req.body.label
    }
  });

  res.status(201).json({
    status: 'success',
    application
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);
  const task = application.tasks.id(req.params.taskId);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (req.body.label !== undefined) task.label = req.body.label;
  if (req.body.done !== undefined) task.done = req.body.done;
  if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || undefined;

  await application.save();

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'task_updated',
    message: `${task.done ? 'Completed' : 'Updated'} task for ${application.company}`,
    meta: {
      label: task.label,
      done: task.done
    }
  });

  res.json({
    status: 'success',
    application
  });
});

export const mockReminder = asyncHandler(async (req, res) => {
  const application = await getApplicationForUser(req.user._id, req.params.id);

  const activity = await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'reminder_mocked',
    message: `Mock reminder queued for ${application.company}`,
    meta: {
      followUpDate: application.followUpDate,
      channel: req.body.channel || 'email'
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Mock reminder queued',
    activity
  });
});

export const exportApplicationsCsv = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="job-applications.csv"');
  res.send(applicationsToCsv(applications));
});

export const extractJobDetails = asyncHandler(async (req, res) => {
  const text = req.body.text || '';
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLine = lines[0] || '';
  const secondLine = lines[1] || '';
  const salaryMatch = text.match(/(?:₹|INR|\$)\s?([\d,.]+)\s?(?:-|to|–)\s?(?:₹|INR|\$)?\s?([\d,.]+)/i);
  const locationMatch = text.match(/(?:Location|Based in|Office):?\s*([A-Za-z,\s]+)(?:\n|$)/i);
  const remoteMatch = text.match(/\b(remote|hybrid|onsite|on-site)\b/i);

  const extracted = {
    role: firstLine.length < 100 ? firstLine : '',
    company: secondLine.length < 100 ? secondLine.replace(/^at\s+/i, '') : '',
    location: locationMatch?.[1]?.trim() || '',
    workMode: remoteMatch
      ? remoteMatch[1].toLowerCase().includes('remote')
        ? 'Remote'
        : remoteMatch[1].toLowerCase().includes('hybrid')
          ? 'Hybrid'
          : 'Onsite'
      : undefined,
    salaryMin: salaryMatch ? Number(salaryMatch[1].replaceAll(',', '')) : undefined,
    salaryMax: salaryMatch ? Number(salaryMatch[2].replaceAll(',', '')) : undefined,
    jobDescription: text
  };

  res.json({
    status: 'success',
    extracted
  });
});

export const actionNeededQuery = (userId, date = new Date()) => {
  const soon = new Date(date);
  soon.setDate(soon.getDate() + 7);

  return {
    user: userId,
    followUpDate: { $lte: soon },
    status: { $nin: finalStatuses }
  };
};
