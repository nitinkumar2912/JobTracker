import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    action: {
      type: String,
      enum: [
        'created',
        'updated',
        'deleted',
        'status_changed',
        'note_added',
        'task_added',
        'task_updated',
        'reminder_mocked',
        'profile_updated'
      ],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
