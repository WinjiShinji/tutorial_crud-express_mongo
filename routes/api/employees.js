const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employeesController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

// route() chaining
router.route('/')
  .get(employeeController.getEmployees) 
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.createEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee) 
  // NOTE: User roles not required as JWT access token is created with User role!

// route() params
router.route('/:id')
  .get(employeeController.getEmployeeId)


module.exports = router