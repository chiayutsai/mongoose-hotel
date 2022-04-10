const headers = require('./headers')

const successHandle = (res, data, message) => {
  res.writeHead(200, headers)
  res.write(
    JSON.stringify({
      status: 'success',
      data,
      message,
    })
  )
  res.end()
}

const errorHandle = (res, message, error) => {
  res.writeHead(200, headers)
  res.write(
    JSON.stringify({
      status: 'false',
      message,
      error,
    })
  )
  res.end()
}
module.exports = { successHandle, errorHandle }
