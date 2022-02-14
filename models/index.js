const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.project = require("./project.model");
db.task = require("./task.model")
module.exports = db