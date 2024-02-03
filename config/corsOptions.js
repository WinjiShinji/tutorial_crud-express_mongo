// Imported middleware to handle Cross Origin Resource Sharing
const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // !origin - dev fix 
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions