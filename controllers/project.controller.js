const db = require("../models")
const Project = db.project;
const User = db.user;

const getProject = (req, res) => {
    const {projectId} = req.query
    Project.findById(projectId).populate("tasks")
        .then(project => {
            res.status(200).send({message: "Find one project", project});
            return;
        })
        .catch(err => {
            res.status(500).send({ message: err});
            return;
        })
}

const getUserProjects = (req, res) => {
    const {userId} = req.query
    User.findById(userId).populate("projects")
        .then(user => {
            res.status(200).send({message:`Found ${user.projects.length} project(s)`, projects: user.projects})
        })
        .catch(err => {
            res.status(500).send({message: err})
            return
        })
}

const createProject = (req, res) => {
    const tasks = [...req.body.tasks]
    const userId = req.body.userId
    const projectDoc = new Project({title: req.body.title})
    Project.create(projectDoc)
        .then(project => {
            db.user.findByIdAndUpdate(
                userId,
                { $push: {projects: project._id}},
                {new: true, useFindAndModify: false}
            )
            .then(user => {
                if(tasks.length > 0) {
                    db.task.insertMany(tasks)
                        .then(docs => {
                            const tasksId = docs.map(doc=>doc._id)
                            Project.findOneAndUpdate({_id: project._id},{$push:{tasks:tasksId}}, {returnDocument: "after"},(err, document) => {
                                if(err) {
                                    res.status(500).send({message: err})
                                    return
                                }
                                res.status(200).send({message: "Saved", project:document})
                            })
                                
                            
                        })
                } else {
                    res.status(200).send({ message: "Project created successfully", project})
                    return;
                }
            })
            .catch(err => {
                res.status(500).send({message: err})
                return
            })
            
        })
        .catch(err => {
            res.status(500).send({message: err})
            return
        })
}

const updateProject = (req, res) => {
    const project = new Project(
        {...req.body.project}
    )
    Project.findByIdAndUpdate(
        project._id,
        {
            $set: {
                title: project.title,
            }
        },
        { new: true }
    )
        .then(project => {
            res.status(200).json({ message: "Project updated successfully", project})
            return;
        })
        .catch(err => {
            res.status(500).send({ message: err})
            return;
        })
}

const deleteProject = (req, res) => {
    const projectId = req.body.projectId
    const userId = req.body.userId
    Project.findById(projectId)
        .then(project => {
            project.remove()
                .then(() => {
                    db.user.findByIdAndUpdate(
                        userId,
                        {$pull: {project: projectId}}
                    )
                        .then(() => {
                            res.status(200).send({ message: "Project successfully deleted" })
                            return;
                        })
                })
                .catch(err => {
                    res.status(500).send({ message: err})
                    return;
                })
        })
}

module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getUserProjects
}