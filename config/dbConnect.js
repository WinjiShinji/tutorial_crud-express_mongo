const mongoose = require('mongoose')

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true, // fix
      useNewUrlParser: true // fix
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = dbConnect