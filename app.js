const express = require('express');
const taskData = require('./task.json');
const Validator = require('./Helper/Validator');
const fs = require('fs');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks',(req, res)=>{
    return res.status(200).json(taskData);
})

app.get('/tasks/:taskId', (req, res) => {
    const tasksNew = taskData.tasks;
    let filteredTask = tasksNew.filter(task => task.id == req.params.taskId);
    if(filteredTask.length == 0) {
        return res.status(404).send("No appropriate task found for your query");
    }
    return res.status(200).json(filteredTask);
});

app.post('/tasks', (req, res) => {
    console.log(req.body);
    const userProvidedDetails = req.body;
    if(Validator.validateTaskInfo(userProvidedDetails).status == true) {
        let taskDataModified = taskData;
        taskDataModified.tasks.push(userProvidedDetails);
        const updatedTasksString = JSON.stringify(taskDataModified, null, 2);
        fs.writeFile('./task.json', updatedTasksString, {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while writing the task to the file, please try recreating the task");
            } else {
                return res.status(201).send("Task has been successfuly validated and created");
            }
        });
    } else {
        return res.status(400).json(Validator.validateTaskInfo(userProvidedDetails));
    }
})

app.put("/tasks/:taskId",(req, res)=>{
    const tasksNew = taskData.tasks;
    let filteredTask = tasksNew.filter(task => task.id == req.params.taskId);
    if(filteredTask.length == 0) {
        return res.status(404).send("No appropriate task found for your query");
    }
    filteredTask[0].title=req.body.title;
    filteredTask[0].description=req.body.description;
    filteredTask[0].completed=req.body.completed;
    const updatedTasksString = JSON.stringify(taskData, null, 2);
    fs.writeFile("./task.json", updatedTasksString, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing to the file:', writeErr);
            return res.status(500).send("Error updating the task.");
        }
        return res.status(200).send(taskData);
    });
})

app.delete("/tasks/:taskId",(req, res)=>{
    const tasksNew = taskData.tasks;
    let filteredTask = tasksNew.filter(task => task.id == req.params.taskId);
    if(filteredTask.length == 0) {
        return res.status(404).send("No appropriate task found for your query");
    }
    const index=tasksNew.indexOf(filteredTask);
    tasksNew.splice(index,1);
    const updatedTasksString = JSON.stringify(taskData, null, 2);
    fs.writeFile("./task.json", updatedTasksString, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing to the file:', writeErr);
            return res.status(500).send("Error updating the task.");
        }
        return res.status(200).send("Deleted");
    });
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;