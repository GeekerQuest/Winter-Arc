const mongoose = require("mongoose");

const userTaskSettingsSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    customTasks: [{
        _id: false,
        id: { type: String, required: true },
        name: { type: String, required: true, trim: true, maxlength: 60 },
        createdOn: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
    }],
}, { timestamps: true });

module.exports = mongoose.model("UserTaskSettings", userTaskSettingsSchema);
