const mongoose = require("mongoose")

const Reservation = require('../models/reservation.js')
const User = require('../models/user.js')
const ParkingSpace = require('../models/parking-space.js')

const getParkingSpaces = async (req, res) => {
        const parking_spaces = await ParkingSpace.find({})
        res.status(200).json(parking_spaces)
}

module.exports = {
    getParkingSpaces
}
