const Team = require('../models/Team');
const Attempt = require('../models/Attempt');
const { scoreAttempt } = require('../utils/scoring');

const TOTAL_TEAMS = Number(process.env.TOTAL_TEAMS) || 16;

// GET /api/admin/overview
exports.overview = async (req, res, next) => {
  try {
    const [registered, submitted, inProgress] = await Promise.all([
      Team.countDocuments(),
      Attempt.countDocuments({ round: 1, status: 'submitted' }),
      Attempt.countDocuments({ round: 1, status: 'in-progress' }),
    ]);
    return res.json({ totalTeams: TOTAL_TEAMS, registered, submitted, inProgress });
  } catch (err) {
    return next(err);
  }
};

// GET /api/admin/teams  -> all registered teams with their Round 1 attempt + score
exports.teams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ teamNumber: 1 }).lean();
    const attempts = await Attempt.find({ round: 1 }).lean();
    const byTeam = new Map(attempts.map((a) => [a.teamNumber, a]));

    const rows = teams.map((t) => {
      const a = byTeam.get(t.teamNumber);
      return {
        teamNumber: t.teamNumber,
        member1Name: t.member1Name,
        member2Name: t.member2Name,
        registeredAt: t.registeredAt,
        attempt: a
          ? {
              attemptId: a._id,
              status: a.status,
              submissionType: a.submissionType,
              startedAt: a.startedAt,
              submittedAt: a.submittedAt,
              score: a.status === 'submitted' ? a.score : null,
            }
          : null,
      };
    });
    return res.json({ teams: rows });
  } catch (err) {
    return next(err);
  }
};

// GET /api/admin/rankings  -> submitted attempts sorted by score desc
exports.rankings = async (req, res, next) => {
  try {
    const submitted = await Attempt.find({ round: 1, status: 'submitted' })
      .populate('team', 'teamNumber member1Name member2Name')
      .sort({ score: -1, submittedAt: 1 })
      .lean();

    const rankings = submitted.map((a, i) => ({
      rank: i + 1,
      teamNumber: a.teamNumber,
      members: a.team ? [a.team.member1Name, a.team.member2Name] : [],
      score: a.score,
      submissionType: a.submissionType,
      submittedAt: a.submittedAt,
    }));
    return res.json({ rankings });
  } catch (err) {
    return next(err);
  }
};

// POST /api/admin/attempts/:id/force-submit
exports.forceSubmit = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id);
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
    if (attempt.status === 'submitted') return res.json({ submitted: true, alreadySubmitted: true });

    attempt.status = 'submitted';
    attempt.submissionType = 'forced';
    attempt.submittedAt = new Date();
    await scoreAttempt(attempt);
    await attempt.save();
    return res.json({ submitted: true });
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/admin/teams/:teamNumber/reset  -> delete the team's attempt (keep registration)
exports.resetAttempt = async (req, res, next) => {
  try {
    const teamNumber = Number(req.params.teamNumber);
    const team = await Team.findOne({ teamNumber });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    const result = await Attempt.deleteOne({ team: team._id, round: 1 });
    return res.json({ deleted: result.deletedCount });
  } catch (err) {
    return next(err);
  }
};
