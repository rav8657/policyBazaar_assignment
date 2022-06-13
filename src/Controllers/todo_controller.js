import user_model from "../models/users_model.js";
import todo_model from "../models/todo_model.js";
import { is_Valid_RequestBody, is_Valid_String, is_Valid_ObjectId } from "../validators/validator.js";


export const addTask = async (req, res) => {
    try {
        let userId = req.params.userId
        let findUser = await user_model.findOne({ userId })

        let userIdFromToken = req.userId
        let { list, task, date, time } = req.body;

        if (findUser._id.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        if (!is_Valid_RequestBody(req.body)) {
            return res.staus(400).send("Provide valid request body.");
        }
        if (!is_Valid_String(list)) {
            return res.staus(400).send("Provide valid list.");
        }
        if (!is_Valid_String(task)) {
            return res.staus(400).send("Provide valid task.");
        }
        if (!is_Valid_String(date)) {
            return res.staus(400).send("Provide valid date.");
        }
        if (!is_Valid_String(time)) {
            return res.staus(400).send("Provide valid time.");
        }

        const todoDetails = await todo_model.create({
            list,
            task,
            date,
            time,
        });
        return res.status(200).send({ status: true, message: "Task added successfully.", data: todoDetails });

    } catch (err) {
        return res.status(500).send({ status: err.message })
    }
};







export const getAllTasks = async (req, res) => {
    try {
        let filterQuery = { isDeleted: false, list: req.body.list };
        if (!is_Valid_RequestBody(req.body)) {
            return res.staus(400).send("Provide valid request body.");
        }
        if (!is_Valid_String(req.body.list)) {
            return res.staus(400).send("Provide valid list.");
        }
        const todoDetails = await todo_model.find(filterQuery);
        return res.status(200).send({ status: true, data: todoDetails });

    } catch (err) {
        return res.status(500).send({ status: err.message })
    }
}





export const getTask = async (req, res) => {
    try {
        let { task, date, time } = req.body
        if (!is_Valid_RequestBody(req.body)) {
            return res.status(400).send("Provide valid request body.");
        }

        const todoDetails = await todo_model.find({ $or: [{ task }, { date }, { time }] });
        let isDeletedArray = todoDetails.map(item => item.isDeleted == true);

        if (isDeletedArray[0] == true) {
            return res.status(400).send({ status: false, message: "Task is Deleted" })
        }
        return res.status(200).send({ status: true, data: todoDetails });


    } catch (err) {
        return res.status(500).send({ status: err.message })
    }
}


export const updateTask = async (req, res) => {
    try {
        let userId = req.params.userId
        let findUser = await user_model.findOne({ userId })
        let userIdFromToken = req.userId

        if (findUser._id.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        let filterQuery = { isDeleted: false, taskId: req.params.taskId };

        let { task, date, time, status } = req.body

        if (!is_Valid_RequestBody(req.body)) {
            return res.staus(400).send("Provide valid request body.");
        }
        if (!is_Valid_ObjectId(req.params.taskId)) {
            return res.status(400).send({ status: false, message: `${req.params.taskId} is not a valid taskId` })
        }

        if (task) {
            if (!is_Valid_String(task)) {
                return res.staus(400).send("Provide valid task.");
            }
        }
        if (date) {
            if (!is_Valid_String(date)) {
                return res.staus(400).send("Provide valid date.");
            }
        }
        if (time) {
            if (!is_Valid_String(time)) {
                return res.staus(400).send("Provide valid time.");
            }
        }
        if (status) {
            if (!is_Valid_String(status)) {
                return res.staus(400).send("Provide valid status.");
            }
        }

        const findTask = await todo_model.findOne({ filterQuery });
        if (status) {
            if (findTask.status === 'Completed') {
                return res.status(400).send({ status: false, message: `${findTask.task} is already completed` })
            }
            if (findTask.status === 'In progress' && status === 'To-do') {
                return res.status(400).send({ status: false, message: `${findTask.task} is already in progress , it can be updated to completed status only` })
            }
            if ((findTask.status === 'In progress' && status === 'Completed') || (findTask.status === 'To-do' && status === 'In progress')) {
                var todoDetails = await todo_model.findOneAndUpdate({ filterQuery }, { $set: req.body }, { new: true });
            }
        }
        return res.status(200).send({ status: true, message: "Task updated successfully.", data: todoDetails });

    } catch (err) {
        return res.status(500).send({ status: err.message })
    }
}




export const deleteTask = async (req, res) => {
    try {
        let userId = req.params.userId
        let findUser = await user_model.findOne({ userId })
        let userIdFromToken = req.userId
        if (findUser._id.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        let { taskId } = req.params;
        if (!is_Valid_ObjectId(taskId)) {
            return res.status(400).send({ status: false, message: `${taskId} is not a valid taskId` })
        }
        let findTask = await todo_model.findById(taskId);
        if (findTask.isDeleted == true) {
            return res.status(200).send({ status: true, message: "Task already deleted." })
        }
        let deleteTask = await todo_model.findOneAndUpdate({ _id: taskId }, { $set: { isDeleted: true } }, { new: true });

        return res.status(200).send({ status: true, message: "Task deleted successfully.", data: deleteTask });


    } catch (err) {
        return res.status(500).send({ status: err.message })
    }
}


