import express from "express";
import { createTask, deleteTask, updateTask } from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getTasks } from "../controllers/task/taskController.js";
import { getTask } from "../controllers/task/taskController.js";

const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks/get", protect, getTasks);
router.get("/task/:Id", protect, getTask);
router.patch("/task/update/:Id", protect, updateTask);
router.delete("/task/delete/:Id", protect, deleteTask);

export default router;
