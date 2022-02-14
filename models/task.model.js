const mongoose = require("mongoose");
const Task = mongoose.model(
    "Task",
    new mongoose.Schema(
            {
                description: String,
                done: Boolean,
                createdAt: Date,
                deadline: Date,
            })
)

module.exports = Task