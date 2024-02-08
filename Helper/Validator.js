class Validator {
    static validateTaskInfo(TaskInfo) {
        if(TaskInfo.hasOwnProperty("title") &&
        TaskInfo.hasOwnProperty("description") &&
        TaskInfo.hasOwnProperty("completed")&&
        typeof (TaskInfo['completed'])==="boolean") {
            return {
                "status": true,
                "message": "Task has been validated"
            };
        } else {
            return {
                "status": false,
                "message": "Task Info is malformed, please provide me all the parameters"
            };
        }
    }
}

module.exports = Validator;