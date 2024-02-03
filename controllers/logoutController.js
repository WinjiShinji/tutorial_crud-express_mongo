
const User = require('../model/user')

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken 
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // Status 204 - no content
  const refreshToken = cookies.jwt
  // Is refreshToken in DB?
  const userExists = await User.findOne({ refreshToken }).exec()
  if (!userExists) {
    res.clearCookie('jwt', { 
      httpOnly: true, sameSite: 'None', secure: true 
    })
    return res.sendStatus(204) // Status 204 - no content
  }
  // Delete refreshToken from Database
  userExists.refreshToken = ''
  // Save user data to DB
  await userExists.save()
  // Clear Cookie
  res.clearCookie('jwt', { 
    httpOnly: true, sameSite: 'None', secure: true 
  }) 
  res.sendStatus(204) // Status 204 - no content
}

module.exports = { handleLogout }