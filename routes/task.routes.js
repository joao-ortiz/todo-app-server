const { authJwt } = require("../middleware");
const controller = require("../controllers/task.controller");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use("/api/task/", authJwt);

    app.post("/api/task/create", controller.createTask)

    app.put("/api/task/update", controller.updateTask)

    app.put("/api/task/delete", controller.deleteTask)
}