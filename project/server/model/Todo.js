import { text } from "express";
import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const Todo = mongoose.model("todos", TodoSchema);

export default Todo;