const mongoose = require("mongoose");
const Project = mongoose.model(
    "Project",
    new mongoose.Schema({
        title: String,
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task"
            }
        ]
    })
)

module.exports = Project