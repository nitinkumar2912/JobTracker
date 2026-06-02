import { Activity } from '../models/Activity.js';
import { Application } from '../models/Application.js';
import { User } from '../models/User.js';
import { buildDemoApplications, demoUser } from './demoData.js';

export const ensureDemoAccount = async ({ reset = false } = {}) => {
  let user = await User.findOne({ email: demoUser.email });

  if (!user) {
    user = await User.create(demoUser);
  } else if (reset) {
    Object.entries(demoUser).forEach(([key, value]) => {
      if (key !== 'password') user[key] = value;
    });
    await user.save();
  }

  const applicationCount = await Application.countDocuments({ user: user._id });

  if (reset || applicationCount === 0) {
    await Application.deleteMany({ user: user._id });
    await Activity.deleteMany({ user: user._id });

    const applications = await Application.insertMany(
      buildDemoApplications().map((application) => ({
        ...application,
        user: user._id
      }))
    );

    await Activity.insertMany(
      applications.map((application) => ({
        user: user._id,
        application: application._id,
        action: 'created',
        message: `Seeded ${application.role} at ${application.company}`,
        meta: {
          status: application.status,
          source: application.source
        },
        createdAt: application.createdAt,
        updatedAt: application.updatedAt
      }))
    );
  }

  return user;
};
