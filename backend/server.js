const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const dns = require("dns");
const { randomInt } = require("crypto");
const app = express();
const DailyProgress = require("./models/DailyProgress");
const UserTaskSettings = require("./models/UserTaskSettings");
const quotes = require("./data/quotes");

// The machine's default DNS resolver refuses Atlas SRV lookups. Use public
// resolvers so mongodb+srv:// connection strings can resolve the cluster.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/quote", (req, res) => {
    const requestedDate = req.query.date;
    const date = typeof requestedDate === "string"
        ? requestedDate
        : new Date().toISOString().slice(0, 10);

    if (requestedDate === undefined) {
        return res.json({ date, quote: quotes[randomInt(quotes.length)] });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "date must use YYYY-MM-DD format." });
    }

    const dateTime = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(dateTime.getTime()) || dateTime.toISOString().slice(0, 10) !== date) {
        return res.status(400).json({ message: "date must be a valid calendar date." });
    }

    const dayNumber = Math.floor(dateTime.getTime() / 86_400_000);
    const quoteIndex = ((dayNumber % quotes.length) + quotes.length) % quotes.length;
    res.json({ date, quote: quotes[quoteIndex] });
});

app.get("/api/progress/:deviceId", async (req, res) => {
    try {
        const [records, settings] = await Promise.all([
            DailyProgress.find({ deviceId: req.params.deviceId })
                .select("date completedTasks -_id")
                .lean(),
            UserTaskSettings.findOne({ deviceId: req.params.deviceId })
                .select("customTasks -_id")
                .lean(),
        ]);
        const dailyTasks = Object.fromEntries(
            records.map(({ date, completedTasks }) => [date, completedTasks])
        );
        res.json({ dailyTasks, customTasks: settings?.customTasks || [] });
    } catch (error) {
        console.error("Could not load progress:", error.message);
        res.status(500).json({ message: "Could not load progress." });
    }
});

app.put("/api/progress/:deviceId", async (req, res) => {
    const { dailyTasks, customTasks = [] } = req.body;

    if (!dailyTasks || typeof dailyTasks !== "object" || Array.isArray(dailyTasks)) {
        return res.status(400).json({ message: "dailyTasks must be an object keyed by date." });
    }

    const entries = Object.entries(dailyTasks);
    const invalidEntry = entries.find(([date, completedTasks]) =>
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Array.isArray(completedTasks) ||
        completedTasks.some((taskId) => typeof taskId !== "string")
    );

    if (invalidEntry) {
        return res.status(400).json({ message: "Each date must have a list of task IDs." });
    }

    if (!Array.isArray(customTasks) || customTasks.length > 100 || customTasks.some((task) =>
        !task || typeof task.id !== "string" || !task.id ||
        typeof task.name !== "string" || !task.name.trim() || task.name.trim().length > 60 ||
        (task.createdOn !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(task.createdOn))
    )) {
        return res.status(400).json({ message: "Custom tasks must have an ID and a name of up to 60 characters." });
    }

    try {
        const deviceId = req.params.deviceId;
        const operations = entries.map(([date, completedTasks]) => ({
            updateOne: {
                filter: { deviceId, date },
                update: { $set: { completedTasks: [...new Set(completedTasks)] } },
                upsert: true,
            },
        }));

        const saves = [
            UserTaskSettings.findOneAndUpdate(
                { deviceId },
                { $set: { customTasks: customTasks.map((task) => ({ ...task, name: task.name.trim() })) } },
                { upsert: true, runValidators: true }
            ),
        ];
        if (operations.length > 0) saves.push(DailyProgress.bulkWrite(operations));
        await Promise.all(saves);

        res.json({ message: "Progress saved.", savedDays: entries.length });
    } catch (error) {
        console.error("Could not save progress:", error.message);
        res.status(500).json({ message: "Could not save progress." });
    }
});
app.get("/api/test", (req, res) => {
    res.json({
        message: "Winter Arc backend is alive ❄️",
        status: "success"
    });
    // sends directly the json so react can easily access
})
async function startServer() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is missing. Add it to backend/.env.");
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    // Avoid printing the connection URI or credentials in an error/stack trace.
    console.error("Server startup failed:", error.name, error.message);
    process.exit(1);
});
