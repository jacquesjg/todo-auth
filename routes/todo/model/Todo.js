const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String
    },
    done: Boolean,
    todoOwner: {
      type: mongoose.Schema.ObjectId, ref: "user"
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("todo", todoSchema);