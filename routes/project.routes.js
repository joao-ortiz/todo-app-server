const { authJwt } = require("../middleware");
const controller = require("../controllers/project.controller");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use("/api/project/", authJwt);

    app.get("/api/project/", controller.getProject)

    app.post("/api/project/create", controller.createProject)

    app.put("/api/project/update", controller.updateProject)

    app.put("/api/project/delete", controller.deleteProject)

    app.get("/api/project/userprojects", controller.getUserProjects)
}