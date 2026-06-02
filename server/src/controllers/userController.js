import { Activity } from '../models/Activity.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const profileFields = [
  'name',
  'headline',
  'location',
  'portfolioUrl',
  'linkedInUrl',
  'githubUrl',
  'resumeUrl',
  'targetRoles',
  'preferredLocations'
];

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  profileFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();

  await Activity.create({
    user: req.user._id,
    action: 'profile_updated',
    message: 'Updated profile details'
  });

  res.json({
    status: 'success',
    user: req.user
  });
});
