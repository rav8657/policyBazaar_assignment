import express from "express";

const router = express.Router();


import { createUser, userLogin } from "../Controllers/user_controller.js"
import { addTask, getAllTasks, getTask,updateTask,deleteTask } from "../Controllers/todo_controller.js";
import {userAuth} from "../middlewares/auth.js"

router.post("/user", createUser);
router.post("/login", userLogin);

router.post("/addTask/:userId",userAuth, addTask);
router.get("/getAllTasks", getAllTasks);
router.get("/getTask", getTask);
router.put("/updateTask/:userId/:taskId",userAuth, updateTask);
router.delete("/deleteTask/:userId/:taskId",userAuth, deleteTask);





export default router;  