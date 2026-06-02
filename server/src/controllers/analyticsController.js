import { Activity } from '../models/Activity.js';
import { Application } from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { APPLICATION_STATUSES, INTERVIEW_STATUSES, JOB_SOURCES, PRIORITIES } from '../utils/constants.js';
import { actionNeededQuery } from './applicationController.js';

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleString('en', {
    month: 'short',
    year: 'numeric'
  });
};

const emptyCounts = (labels) => labels.map((name) => ({ name, value: 0 }));

export const getSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const [
    total,
    offers,
    rejections,
    interviews,
    thisMonth,
    dueSoon,
    overdue,
    byStatusRaw,
    recentActivity
  ] = await Promise.all([
    Application.countDocuments({ user: req.user._id }),
    Application.countDocuments({ user: req.user._id, status: 'Offer' }),
    Application.countDocuments({ user: req.user._id, status: 'Rejected' }),
    Application.countDocuments({ user: req.user._id, status: { $in: INTERVIEW_STATUSES } }),
    Application.countDocuments({ user: req.user._id, appliedDate: { $gte: startOfMonth } }),
    Application.countDocuments({
      ...actionNeededQuery(req.user._id, now),
      followUpDate: { $gte: startOfToday, $lte: nextWeek }
    }),
    Application.countDocuments({
      user: req.user._id,
      followUpDate: { $lt: startOfToday },
      status: { $nin: ['Offer', 'Rejected'] }
    }),
    Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } },
      { $sort: { name: 1 } }
    ]),
    Activity.find({ user: req.user._id })
      .populate('application', 'company role status')
      .sort({ createdAt: -1 })
      .limit(8)
  ]);

  const byStatus = emptyCounts(APPLICATION_STATUSES).map((item) => ({
    ...item,
    value: byStatusRaw.find((status) => status.name === item.name)?.value || 0
  }));

  const followUps = await Application.find(actionNeededQuery(req.user._id, now))
    .sort({ followUpDate: 1 })
    .limit(6)
    .select('company role status priority followUpDate');

  res.json({
    status: 'success',
    summary: {
      total,
      offers,
      rejections,
      interviews,
      thisMonth,
      dueSoon,
      overdue,
      byStatus,
      followUps,
      recentActivity
    }
  });
});

export const getTrends = asyncHandler(async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
    return monthKey(date);
  });

  const [monthlyRaw, statusRaw, sourceRaw, priorityRaw, offers, rejections] = await Promise.all([
    Application.aggregate([
      { $match: { user: req.user._id, appliedDate: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' }
          },
          value: { $sum: 1 }
        }
      },
      { $project: { _id: 0, year: '$_id.year', month: '$_id.month', value: 1 } }
    ]),
    Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } }
    ]),
    Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$source', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } }
    ]),
    Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } }
    ]),
    Application.countDocuments({ user: req.user._id, status: 'Offer' }),
    Application.countDocuments({ user: req.user._id, status: 'Rejected' })
  ]);

  const monthlyMap = new Map(monthlyRaw.map((item) => [`${item.year}-${String(item.month).padStart(2, '0')}`, item.value]));

  res.json({
    status: 'success',
    trends: {
      monthlyApplications: monthKeys.map((key) => ({
        name: monthLabel(key),
        value: monthlyMap.get(key) || 0
      })),
      statusDistribution: emptyCounts(APPLICATION_STATUSES).map((item) => ({
        ...item,
        value: statusRaw.find((status) => status.name === item.name)?.value || 0
      })),
      sourceBreakdown: emptyCounts(JOB_SOURCES).map((item) => ({
        ...item,
        value: sourceRaw.find((source) => source.name === item.name)?.value || 0
      })),
      priorityBreakdown: emptyCounts(PRIORITIES).map((item) => ({
        ...item,
        value: priorityRaw.find((priority) => priority.name === item.name)?.value || 0
      })),
      offerRejectionRatio: [
        { name: 'Offers', value: offers },
        { name: 'Rejections', value: rejections }
      ]
    }
  });
});
