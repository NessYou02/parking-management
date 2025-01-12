
const express = require('express')
const router = express.Router()

const  {getParkingSpaces} = require('../controllers/parking-space.js')

//Retrieve a list of all parking spaces 
router.get('/', getParkingSpaces)


module.exports = router

