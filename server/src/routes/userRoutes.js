import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch(
  '/profile',
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('portfolioUrl').optional({ checkFalsy: true }).isURL().withMessage('Portfolio URL must be valid'),
    body('linkedInUrl').optional({ checkFalsy: true }).isURL().withMessage('LinkedIn URL must be valid'),
    body('githubUrl').optional({ checkFalsy: true }).isURL().withMessage('GitHub URL must be valid'),
    body('resumeUrl').optional({ checkFalsy: true }).isURL().withMessage('Resume URL must be valid'),
    body('targetRoles').optional().isArray().withMessage('Target roles must be an array'),
    body('preferredLocations').optional().isArray().withMessage('Preferred locations must be an array')
  ],
  validate,
  updateProfile
);

export default router;
