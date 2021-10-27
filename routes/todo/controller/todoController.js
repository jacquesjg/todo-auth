const Todo = require('../model/Todo');
const User = require('../../users/model/User');
const errorHandler = require("../../../utils/errorHandler/errorHandler");

async function createTodo(req, res) {
  try {
    const { todo } = req.body;

    if (!todo) {
      res.json({ error: "error", message: "no todo inputted" })
    } else {
      const decodedData = res.locals.decodedData;
      const foundUser = await User.findOne({ email: decodedData.email })

      const createdTodo = new Todo({
        todoOwner: foundUser._id,
        todo,
      });

      const savedTodo = await createdTodo.save();
      foundUser.todoHistory.push(savedTodo._id);

      await foundUser.save();

      res.json({ message: "success", createdTodo });
    }
  } catch (e) {
    res
      .status(500)
      .json(errorHandler(e));
  }
};

async function getAllTodo(req, res) {
  const foundAllTodo = await Todo.find({}).populate("todoOwner", "username");
  res.json({ message: "success", payload: foundAllTodo });
};

async function updateTodoById(req, res) {
  try {
    const foundTodo = await Todo.findById(req.params.id);
    const foundUser = await User.findOne({ email: res.locals.decodedData.email });
    if (!foundTodo) {
      res.status(404).json({ message: "failure", error: "todo not found" })
    } else if (JSON.stringify(foundUser._id) !== JSON.stringify(foundTodo.todoOwner)) {
      res.status(403).json({ message: "failure", error: "user can only update their own todo" });
    } else {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.json({ message: "success", payload: updatedTodo })
    }
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message })
  }
}

async function deleteTodoById(req, res) {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res
        .status(404)
        .json({ message: "failure", error: "todo not found" })
    } else {
      const decodedData = res.locals.decodedData;
      const foundUser = await User.findOne({ email: decodedData.email });
      const userTodoHistoryArray = foundUser.todoHistory;
      const filteredTodoHistoryArray = userTodoHistoryArray.filter(
        (item) => item._id.toString() !== req.params.id
      );

      foundUser.todoHistory = filteredTodoHistoryArray;
      await foundUser.save();

      res.json({
        message: "success",
        deleted: deletedTodo,
      })
    }
  } catch (e) {
    res.status(500).json(errorHandler(e));
  }
}

module.exports = {
  createTodo,
  getAllTodo,
  updateTodoById,
  deleteTodoById,
}