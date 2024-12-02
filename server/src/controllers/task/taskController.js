import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, status, completed, priority } =
      req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required" });
    }

    const task = TaskModel({
      title,
      description,
      dueDate,
      status,
      completed,
      priority,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log("Your Task could not be created", error.message);
    res.status(401).json({ message: error.message });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "You need to be logged in to get your tasks" });
    }

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Your Tasks could not be fetched", error.message);
    res.status(401).json({ message: error.message });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { Id } = req.params;
    if (!Id) {
      return res
        .status(404)
        .json({ message: "Please provide a valid task id" });
    }

    const task = await TaskModel.findById(Id);

    if (!task) {
      return res.status(404).json({ message: "Task not found or deleted" });
    }

    if (!task.user.equals(userId)) {
      res
        .status(401)
        .json({ message: "You are not authorized to view this task" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.log("Your Task could not be fetched", error.message);
    res.status(401).json({ message: error.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { Id } = req.params;
    const { title, description, dueDate, status, completed, priority } =
      req.body;
    if (!Id) {
      return res
        .status(404)
        .json({ message: "Please provide a valid task id" });
    }

    const task = await TaskModel.findById(Id);

    if (!task) {
      return res.status(404).json({ message: "Task not found or deleted" });
    }

    //check if the user is the owner of the task
    if (!task.user.equals(userId)) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this task" });
    }

    //update the task with the new data if provided or keep the old data
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.completed = completed || task.completed;
    task.priority = priority || task.priority;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.log("Your Task could not be updated", error.message);
    res.status(401).json({ message: error.message });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { Id } = req.params;
    if (!Id) {
      return res
        .status(404)
        .json({ message: "Please provide a valid task id" });
    }

    const task = await TaskModel.findById(Id);
    if (!task) {
      res.status(404).json({ message: "Task not found or deleted" });
    }
    //check if the user is the owner of the task
    if (!task.user.equals(userId)) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this task" });
    }

    await TaskModel.findByIdAndDelete(Id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Your Task could not be deleted", error.message);
    res.status(401).json({ message: error.message });
  }
});
