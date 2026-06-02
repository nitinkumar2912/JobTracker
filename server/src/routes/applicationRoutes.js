import express from 'express';
import { body, param, query } from 'express-validator';
import {
  addInterviewNote,
  addTask,
  createApplication,
  deleteApplication,
  exportApplicationsCsv,
  extractJobDetails,
  getApplication,
  listApplications,
  mockReminder,
  updateApplication,
  updateTask
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  JOB_SOURCES,
  PRIORITIES,
  WORK_MODES
} from '../utils/constants.js';

const router = express.Router();

const mongoId = (field = 'id') => param(field).isMongoId().withMessage('Invalid id');

const applicationValidation = (mode = 'create') => {
  const required = mode === 'create';
  const rule = (field) => (required ? body(field) : body(field).optional());

  return [
    rule('company').trim().isLength({ min: 1, max: 120 }).withMessage('Company name is required'),
    rule('role').trim().isLength({ min: 1, max: 140 }).withMessage('Job title is required'),
    body('jobUrl').optional({ checkFalsy: true }).isURL().withMessage('Job URL must be valid'),
    body('source').optional().isIn(JOB_SOURCES).withMessage('Invalid source'),
    body('workMode').optional().isIn(WORK_MODES).withMessage('Invalid work mode'),
    body('employmentType').optional().isIn(EMPLOYMENT_TYPES).withMessage('Invalid employment type'),
    body('status').optional().isIn(APPLICATION_STATUSES).withMessage('Invalid status'),
    body('priority').optional().isIn(PRIORITIES).withMessage('Invalid priority'),
    body('salaryMin').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Salary min must be positive'),
    body('salaryMax').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Salary max must be positive'),
    body('appliedDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Applied date must be valid'),
    body('followUpDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Follow-up date must be valid'),
    body('contact.email').optional({ checkFalsy: true }).isEmail().withMessage('Recruiter email must be valid'),
    body('tags')
      .optional()
      .custom((value) => Array.isArray(value) || typeof value === 'string')
      .withMessage('Tags must be an array or comma-separated string'),
    body('coverLetterUsed').optional().isBoolean().withMessage('Cover letter field must be true or false')
  ];
};

router.use(protect);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional({ checkFalsy: true }).isIn(APPLICATION_STATUSES).withMessage('Invalid status filter'),
    query('source').optional({ checkFalsy: true }).isIn(JOB_SOURCES).withMessage('Invalid source filter'),
    query('priority').optional({ checkFalsy: true }).isIn(PRIORITIES).withMessage('Invalid priority filter'),
    query('from').optional({ checkFalsy: true }).isISO8601().withMessage('From date must be valid'),
    query('to').optional({ checkFalsy: true }).isISO8601().withMessage('To date must be valid')
  ],
  validate,
  listApplications
);

router.post('/', applicationValidation('create'), validate, createApplication);
router.get('/export/csv', exportApplicationsCsv);
router.post(
  '/extract',
  [body('text').trim().isLength({ min: 20 }).withMessage('Paste at least 20 characters from the job description')],
  validate,
  extractJobDetails
);

router.get('/:id', mongoId(), validate, getApplication);
router.patch('/:id', [mongoId(), ...applicationValidation('update')], validate, updateApplication);
router.delete('/:id', mongoId(), validate, deleteApplication);

router.post(
  '/:id/notes',
  [
    mongoId(),
    body('title').trim().isLength({ min: 2 }).withMessage('Note title is required'),
    body('summary').trim().isLength({ min: 5 }).withMessage('Note summary is required'),
    body('date').optional({ checkFalsy: true }).isISO8601().withMessage('Date must be valid')
  ],
  validate,
  addInterviewNote
);

router.post(
  '/:id/tasks',
  [
    mongoId(),
    body('label').trim().isLength({ min: 2 }).withMessage('Task label is required'),
    body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Due date must be valid')
  ],
  validate,
  addTask
);

router.patch(
  '/:id/tasks/:taskId',
  [
    mongoId(),
    mongoId('taskId'),
    body('label').optional().trim().isLength({ min: 2 }).withMessage('Task label must be at least 2 characters'),
    body('done').optional().isBoolean().withMessage('Done must be true or false'),
    body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Due date must be valid')
  ],
  validate,
  updateTask
);

router.post('/:id/reminder/mock', mongoId(), validate, mockReminder);

export default router;
