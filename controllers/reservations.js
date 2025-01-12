const mongoose = require("mongoose")

const Reservation = require('../models/reservation.js')
const User = require('../models/user.js')
const ParkingSpace = require('../models/parking-space.js')

const getReservations = async (req, res) => {
    try {
      // Extract query parameters for filtering
      const { status, userId, parkingSpaceId } = req.query;

      // Build a filter object based on provided query parameters
      const filter = {};
      if (status){
        filter.status = status;
        }
      if (userId) {
        filter.userId = userId;
        }
      if (parkingSpaceId) {
        filter.parkingSpaceId = parkingSpaceId;
    }
    // Retrieve filtered reservations from the database
    const reservations = await Reservation.find(filter)
    // Return the reservations
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const getReservationById = async (req, res) => {
    try {
      const { reservationId } = req.params;
  
      // Find the reservation by ID and populate user and parking space details
      const reservation = await Reservation.findById(reservationId)
      
      // If reservation is not found, return a 404 error
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found.' });
      }
  
      // Calculate duration in hours and include it in the response
      const duration = (new Date(reservation.endTime) - new Date(reservation.startTime)) / (1000 * 60 * 60); // Duration in hours
  
      // Return reservation details along with the calculated duration
      res.status(200).json({
        reservation,
        durationHours: duration.toFixed(2) // Including the duration rounded to 2 decimal places
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
  

const createReservation = async (req, res) => {
  try {
    const { userId, parkingSpaceId, startTime, endTime } = req.body;

    // Validate required fields
    if (!userId || !parkingSpaceId || !startTime || !endTime) {
      return res.status(400).json({ message: 'userId, parkingSpaceId, startTime, and endTime are required.' });
    }

    // Optional: Verify that the user exists
     const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Optional: Verify that the parking space exists
     const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!parkingSpace) {
      return res.status(404).json({ message: 'Parking space not found.' });
    }

    // Optional: Check that the end time is after the start time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time.' });
    }

    // Create new reservation
    const newReservation = new Reservation({
      userId,
      parkingSpaceId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'active' // default status
    });

    // Save the reservation to the database
    await newReservation.save();

    // Optional: Update references on User and ParkingSpace
    user.reservations.push(newReservation._id);
    await user.save();
    
    parkingSpace.reservations.push(newReservation._id);
    await parkingSpace.save();

    // Send success response
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: newReservation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const updateReservationStatus = async (req, res) => {
    try {
      const { reservationId } = req.params;
      const { status } = req.body;
  
      // Check if the status provided is valid
      const validStatuses = ['active', 'completed', 'canceled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Allowed values are: active, completed, canceled.' });
      }
  
      // Find the reservation by ID and update its status
      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        { status, updatedAt: Date.now() }, // Update the status and updatedAt timestamp
        { new: true } // Return the updated document
      );
  
      // If reservation is not found, return 404
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found.' });
      }
  
      // Send the updated reservation in the response
      res.status(200).json({
        message: 'Reservation status updated successfully.',
        reservation
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };

  
const deleteReservation = async (req, res) => {
    try {
      const { reservationId } = req.params;
  
      // Find and delete the reservation
      const reservation = await Reservation.findByIdAndDelete(reservationId);
  
      // If reservation is not found, return a 404 error
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found.' });
      }
  
      // Success response if deletion was successful
      res.status(200).json({ message: 'Reservation canceled successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
  
  

module.exports = {
    getReservations,
    createReservation,
    updateReservationStatus,
    deleteReservation,
    getReservationById
}
