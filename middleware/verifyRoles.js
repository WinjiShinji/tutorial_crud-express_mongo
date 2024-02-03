const verifyRoles = (...allowedRoles) => {  // ...Rest Operator - allows unlimited parameters
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401) // Status 401 - unauthorized
    const rolesArray = [...allowedRoles] // ...Spread Operator - spreads data from parameters
    // console.log(rolesArray) // testing
    // console.log(req.roles) // testing
    const result = req.roles.map(
      role => rolesArray.includes(role) // returns true if match
    ).find(value => value === true)
    if (!result) return res.sendStatus(401) // Status 401 - unauthorized
    // console.log(result) // testing
    next()
  }
}

module.exports = verifyRoles