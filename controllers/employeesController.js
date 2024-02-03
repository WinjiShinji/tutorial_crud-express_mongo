const Employee = require('../model/employee')
 
// Get all employee data
const getEmployees = async (req, res) => {
  const employees = await Employee.find()
  if (!employees) return res.status(204).json({ 'message': 'No employees found!'})
  res.json(employees)
}

// Get employee by :id
const getEmployeeId = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ 'message': 'ID parameter is required!'})
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec()
  // No ID
  if (!employee) {
    return res.status(204).json({ 'message': `No employee matches ID ${req.params.id}` })
  }
  // Return Data
  res.json(employee)
}

// Creates new employee
const createEmployee = async (req, res) => {
  // No First | Last name
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(400).json({ 
      'message': 'First and last name required'
    })
  }
  // Return Data
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname
    })
    res.status(201).json(result) // Status 201 - created
  } catch (error) {
    console.error(error)
  }
}

// Updates employee data
const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ 'message': 'ID parameter is required!'})
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec()
  // No ID
  if (!employee) {
    return res.status(204).json({ 'message': `No employee matches ID ${req.body.id}` })
  }

  // Set firstname & lastname
  if (req.body?.firstname) employee.firstname = req.body.firstname
  if (req.body?.lastname) employee.lastname = req.body.lastname

  // Returns data
  const result = await employee.save()
  res.json(result)
}

// Deletes employee data
const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ 'message': 'ID parameter is required!'})
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec()
  // No ID
  if (!employee) {
    return res.status(204).json({ 'message': `No employee matches ID ${req.body.id}` })
  }

  // Returns data
  const result = await employee.deleteOne({ _id: req.body.id })
  res.json(result)
}


module.exports = {
  getEmployees,
  getEmployeeId,
  createEmployee,
  updateEmployee,
  deleteEmployee
}