const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../users/lib/authMiddleware/');
const { createTodo, getAllTodo, updateTodoById, deleteTodoById } = require('./controller/todoController');

router.get(
  "/get-all-todo",
  getAllTodo,
)

router.post(
  "/create-todo",
  jwtMiddleware,
  createTodo
);

router.put(
  "/update-todo-by-id/:id",
  jwtMiddleware,
  updateTodoById,
);

router.delete(
  "/delete-todo-by-id/:id",
  jwtMiddleware,
  deleteTodoById,
)

module.exports = router;