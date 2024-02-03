const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401) // Status 401 - unauthorized
  // console.log(authHeader) // Testing
  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403) // Status 403 - forbidden
      req.user = decoded.UserInfo.username
      req.roles = decoded.UserInfo.roles
      next()
    }
  )
}

module.exports = verifyJWT