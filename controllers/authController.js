const User = require('../model/user')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const handleUserLogin = async (req, res) => {
  const {user, pass} = req.body
  if (!user||!pass) return res.status(400).json({ 
    "message": "Username and password required!"
  }) // status 400 - bad request

  const userExists = await User.findOne({ username: user }).exec()
  if (!userExists) return res.sendStatus(401) // status 401 - Unauthorized
  // Evaluate Password
  const match = await bcrypt.compare(pass, userExists.password)
  if (match) {
    // Get Roles
    const roles = Object.values(userExists.roles)

    // Create JWTs
    const accessToken = JWT.sign( 
      { // Payload
        "UserInfo": {
          "username": userExists.username,
          "roles": roles
        }, 
      },
      process.env.ACCESS_TOKEN_SECRET, // Secret Key
      { expiresIn: '60s'} // Options 
    )
    const refreshToken = JWT.sign(
      { "username": userExists.username }, // Payload
      process.env.REFRESH_TOKEN_SECRET, // Secret Key
      { expiresIn: '1d'} // Options
    )

    // Save Token
    userExists.refreshToken = refreshToken
    // Save updated user
    await userExists.save()

    // Send Tokens
    res.cookie('jwt', refreshToken, { 
      httpOnly: true, sameSite: 'None', secure: true, // sameSite & secure - fix for CORS/cookies
      maxAge: 24 * 60 * 60 * 1000 
    })
    res.json({ accessToken }) // Send access token to Front-End
  } else {
    res.sendStatus(401) // status 401 - Unauthorized
  }
}

module.exports = { handleUserLogin }