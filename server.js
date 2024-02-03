require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const mongoose = require('mongoose')
const dbConnect = require('./config/dbConnect')

const app = express()
const PORT = process.env.PORT || 3500

// Connect to MongoDB
dbConnect()

// ---- Middleware ---- //
// Custom middleware logger
app.use(logger)

// Handle credentials check - before CORS!
app.use(credentials)

// Imported middleware to handle Cross Origin Resource Sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data (form data)
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// Imported middleware for cookies
app.use(cookieParser())

// built-in middleware for static files
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public'))) // enables css on /subdir


// ---- Routes ---- //
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

// ---- Protected Routes ---- // 
app.use(verifyJWT)
// API
app.use('/employees', require('./routes/api/employees'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found")
  }
})

// ---- Error Handler ---- //
app.use(errorHandler)

// Check MongoDB connection
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {console.log(`listening on port ${PORT}`)}) 
})