const db = require("../models");
const Task = db.task;

const createTask = (req, res) => {
    const projectId = req.body.projectId;
    const task = req.body.task

    Task.create(task)
        .then(task => {
            db.project.findByIdAndUpdate(projectId, {$push: {tasks: task._id}})
                .then(project => {
                    res.status(200).send({message: "Tasks created with success", task, project})
                    return
                })
                .catch(err => {
                    res.status(500).send({ message: err})
                    return
                })
        })
        .catch(err => {
            res.status(500).send({ message: err})
            return
        })
}

const deleteTask = (req, res) => {
    const taskId = req.body.taskId
    const projectId = req.body.projectId
    Task.findByIdAndDelete(taskId)
        .then(task => {
            db.project.findByIdAndUpdate(projectId,{$pull:{tasks: taskId}})
                .then(() => {
                    res.status(200).send({message: "Task deleted"})
                return
                })
                .catch(err => {
                    res.status(500).send({ message: err})
                    return
                })
            
        })
        .catch(err => {
            res.status(500).send({ message: err})
            return
        })
}

const updateTask = (req, res) => {
    const task = req.body.task

    Task.findByIdAndUpdate(
        task._id,
        {
            $set: {
                ...task
            }
        },
        { new: true }
    )
        .then(task => {
            res.status(200).json({ message: "Task updated successfully", task})
            return;
        })
        .catch(err => {
            res.status(500).send({ message: err})
            return;
        })
}

module.exports = {
    createTask,
    deleteTask,
    updateTask
}