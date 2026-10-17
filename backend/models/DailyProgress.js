const mongoose = require("mongoose");

const dailyProgressSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    completedTasks: { type: [String], default: [] },
}, { timestamps: true });

dailyProgressSchema.index({ deviceId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyProgress", dailyProgressSchema);
