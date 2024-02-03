const { v4: uuid } = require('uuid')
const { format } = require('date-fns')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    await fsPromises.mkdir(path.join(__dirname, '..', 'logs'), {recursive: true})
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
  } catch (err) {
    console.error(err)
  }
}

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(req.url)
  next()
}

module.exports = { logEvents, logger }