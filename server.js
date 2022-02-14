const express = require("express");
const cors = require("cors");
const app = express();
var crosOptions = {
    origin: "http://localhost:3000"
};

const db = require("./models");

db.mongoose
    .connect(
        "mongodb+srv://user:123@cluster0.iwuxm.mongodb.net/todo-project?retryWrites=true&w=majority"
        )
    .then(() => {
    })
    .catch(err => {
        console.error("connection error", err);
        process.exit();
    });

    

app.use(cors(crosOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({message: "hello from backend"});
});

require("./routes/auth.routes")(app)
require("./routes/project.routes")(app)
require("./routes/task.routes")(app)

const PORT =  process.nextTick.PORT || 8080;
app.listen(PORT, () => {
})
