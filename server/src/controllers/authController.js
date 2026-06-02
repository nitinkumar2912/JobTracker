import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ensureDemoAccount } from '../utils/seedDemoAccount.js';
import { signToken } from '../middleware/authMiddleware.js';

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

export const register = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    headline: req.body.headline,
    location: req.body.location
  });

  await Activity.create({
    user: user._id,
    action: 'profile_updated',
    message: 'Created account and profile'
  });

  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  sendAuthResponse(res, user);
});

export const demoLogin = asyncHandler(async (_req, res) => {
  const user = await ensureDemoAccount();
  sendAuthResponse(res, user);
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  });
});

export const logout = (_req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out'
  });
};
