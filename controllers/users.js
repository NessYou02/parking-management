const mongoose = require("mongoose")

const Reservation = require('../models/reservation.js')
const User = require('../models/user.js')
const ParkingSpace = require('../models/parking-space.js')

const getUsers = async (req, res) => {
    try {
        const { role } = req.query;

        //create a filter object if role is not empty        
        const filter = role ? { role } : {};

        const users = await User.find(filter);
        
        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({ error: "An error occurred while fetching users" });
    }
}

const getUserbyName = async (req, res) => {
        const name = req.query.name
        const user = await User.find({
            'username':new RegExp(name, 'i')
        })
        res.status(200).json(user)
}
const getReservationsbyId = async (req, res) => {
        const id = req.query.id
        const reservations = await User.findById(id,'reservations' )
        res.status(200).json(reservations)
}

const createUser = async (req, res) => {
    try {
      const { username, role } = req.body;

      //validation to check for required fields
      if (!username || !role) {
        return res.status(400).json({ message: 'Username and role are required.' });
      }
  
      // check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username is already taken.' });
      }
  
      //create a new User instance
      const newUser = new User({
        username,
        role,
        reservations: [] 
      });
  
      //save the new user to the database
      await newUser.save();
  
      res.status(201).json({
        message: 'User created successfully',
        user: newUser
      });
    } catch (error) {

        console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };

  
const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      //delete related reservations
      await Reservation.deleteMany({ userId: user._id });
  
      // update related parking spaces to remove user references
      await ParkingSpace.updateMany(
        { reservations: user._id },
        { $pull: { reservations: user._id } }
      );
  
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User and related data deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
  

module.exports = {
    getUsers,
    getUserbyName,
    getReservationsbyId,
    createUser,
    deleteUser
}
