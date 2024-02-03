const User = require('../model/user')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401) // Status 401 - unauthorized
  const refreshToken = cookies.jwt
  // Find user with matching refresh token
  const userExists = await User.findOne({ refreshToken }).exec()
  if (!userExists) return res.sendStatus(403) // Status 403 - forbidden
  // Evaluate refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || userExists.username !== decoded.username) return res.sendStatus(403) // Status 403 - forbidden
      // Get User Roles
      const roles = Object.values(userExists.roles)
      // Create access token
      const accessToken = jwt.sign(
        { // Payload
          "UserInfo": {
            "username": decoded.username,
            "roles": roles
          } 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      )
      // Send Access Token to front-end
      res.json({ accessToken })
    }
  )
}

module.exports = { handleRefreshToken }