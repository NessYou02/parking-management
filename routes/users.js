
const express = require('express')
const router = express.Router()

const  {
    getUsers,
    getUserbyName,
    getReservationsbyId,
    createUser,
    deleteUser
    } = require('../controllers/users.js')

//Get all the users
router.get('/', getUsers)

//Retrieve information about a specific user
router.get('/username', getUserbyName)

//Get a list of all reservations made by a user
router.get('/reservations', getReservationsbyId)

// Create a new user account  
router.post('/create', createUser)

// Delete a user account and all related data, if applicable
router.delete('/delete/:userId',deleteUser)



module.exports = router
