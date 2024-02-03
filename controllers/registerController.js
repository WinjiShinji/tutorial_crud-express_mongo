const User = require('../model/user')
const bcrypt = require('bcrypt')
const saltRounds = 10

const handleNewUser = async (req, res) => {
  const { user, pass } = req.body
  if (!user || !pass) {
    return res.status(400).json({ 
      "message": "Username and password are required!"
    }) // status 400 - bad request
  }
  // check for duplicate usernames
  const duplicate = await User.findOne({ username: user }).exec() // .exec() - fixes repeated query from async/await 
  if (duplicate) return res.sendStatus(409) // status 409 - conflict
  try {
    // Encrypt the Password
    const hashedPass = await bcrypt.hash(pass, saltRounds)

    // Create & Store the new User
    const newUser = User.create({
      "username": user,
      "password": hashedPass
    })

    
    res.status(201).json({ "success": `New user ${user} created`}) // status 201 - created
  } catch (error) {
    res.status(500).json({ "message": error.message }) // status 500 - internal server error
  }
}

module.exports = { handleNewUser }