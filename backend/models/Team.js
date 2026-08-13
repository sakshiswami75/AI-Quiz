const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    // 1..16, unique so a team can register only once
    teamNumber: { type: Number, required: true, unique: true, min: 1, max: 16 },
    member1Name: { type: String, required: true, trim: true }, // 1st-semester student
    member2Name: { type: String, required: true, trim: true }, // 3rd-semester student
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
