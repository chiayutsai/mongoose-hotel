const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title為必填欄位'],
    },
  },
  { versionKey: false, timestamps: true }
)

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
