const http = require('http')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const headers = require('./headers')
const Todo = require('./models/todo')
const { successHandle, errorHandle } = require('./handles')
dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose
  .connect(DB)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => console.log(error))

const requestListener = async (req, res) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  if (req.url == '/todos' && req.method == 'GET') {
    const todos = await Todo.find()
    successHandle(res, todos)
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const newTodo = await Todo.create({
          title: data.title,
        })
        successHandle(res, newTodo)
      } catch (error) {
        errorHandle(res, '欄位填寫不正確', error)
      }
    })
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    await Todo.deleteMany({})
    successHandle(res, [])
  } else if (req.url.startsWith('/todos') && req.method == 'DELETE') {
    const id = req.url.split('/').pop()
    Todo.findByIdAndDelete(id)
      .then(() => {
        successHandle(res, '', '刪除成功')
      })
      .catch((error) => {
        errorHandle(res, '無此ID', error)
      })
  } else if (req.url.startsWith('/todos') && req.method == 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop()
        const updateTitle = JSON.parse(body).title
        console.log(updateTitle)
        if (updateTitle != undefined) {
          const updateTodo = await Todo.findByIdAndUpdate(id, { title: updateTitle }, { returnDocument: 'after' })
          successHandle(res, updateTodo, '更新成功')
        } else {
          errorHandle(res, '請填寫更新的 title 內容')
        }
      } catch (error) {
        errorHandle(res, '欄位填寫錯誤或無此 ID', error)
      }
    })
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網路路由',
      })
    )
    res.end()
  }
}
const server = http.createServer(requestListener)
server.listen(process.env.PORT)
