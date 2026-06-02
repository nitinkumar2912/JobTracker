import mongoose from 'mongoose';
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  JOB_SOURCES,
  PRIORITIES,
  WORK_MODES
} from '../utils/constants.js';

const taskSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    done: {
      type: Boolean,
      default: false
    },
    dueDate: Date
  },
  { timestamps: true }
);

const interviewNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    type: {
      type: String,
      default: 'Interview',
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000
    },
    outcome: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

const interviewRoundSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true,
      trim: true
    },
    interviewer: {
      type: String,
      default: ''
    },
    date: Date,
    result: {
      type: String,
      enum: ['Pending', 'Passed', 'Rejected', 'No decision'],
      default: 'Pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 120
    },
    role: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 140
    },
    jobUrl: {
      type: String,
      default: '',
      trim: true
    },
    source: {
      type: String,
      enum: JOB_SOURCES,
      default: 'LinkedIn'
    },
    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120
    },
    workMode: {
      type: String,
      enum: WORK_MODES,
      default: 'Hybrid'
    },
    salaryMin: {
      type: Number,
      min: 0
    },
    salaryMax: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      maxlength: 8
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: 'Full-time'
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Saved',
      index: true
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'Medium',
      index: true
    },
    appliedDate: {
      type: Date
    },
    followUpDate: {
      type: Date,
      index: true
    },
    contact: {
      name: {
        type: String,
        default: '',
        trim: true
      },
      email: {
        type: String,
        default: '',
        trim: true,
        lowercase: true
      },
      linkedInOrPhone: {
        type: String,
        default: '',
        trim: true
      }
    },
    notes: {
      type: String,
      default: '',
      maxlength: 6000
    },
    tags: {
      type: [String],
      default: []
    },
    resumeVersion: {
      type: String,
      default: ''
    },
    resumeLink: {
      type: String,
      default: ''
    },
    coverLetterUsed: {
      type: Boolean,
      default: false
    },
    jobDescription: {
      type: String,
      default: ''
    },
    interviewNotes: {
      type: [interviewNoteSchema],
      default: []
    },
    interviewRounds: {
      type: [interviewRoundSchema],
      default: []
    },
    tasks: {
      type: [taskSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ user: 1, company: 1 });
applicationSchema.index({ user: 1, role: 1 });
applicationSchema.index({ user: 1, source: 1 });
applicationSchema.index({ company: 'text', role: 'text', notes: 'text', tags: 'text' });

applicationSchema.pre('validate', function normalizeTags(next) {
  if (Array.isArray(this.tags)) {
    this.tags = this.tags
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  if (this.salaryMin && this.salaryMax && this.salaryMin > this.salaryMax) {
    this.invalidate('salaryMax', 'Salary max must be greater than salary min');
  }

  next();
});

export const Application = mongoose.model('Application', applicationSchema);
