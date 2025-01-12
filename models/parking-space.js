const mongoose = require("mongoose")
const { Schema } = mongoose;


const parkingSpaceSchema = new mongoose.Schema({
    location: {
        address: String,
        city: String,
      },
    type: { 
        type: String, 
        enum: ['compact', 'standard', 'handicap'],
        required: true 
    },
    availabilityStatus: {
        type: String, 
        enum: ['available', 'occupied', 'maintenance'], 
        default: 'available' 
    },
    hourlyRate: {
        type: Number,
        required: true 
    },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
    });

parkingSpaceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
    });
    
    
const ParkingSpace = mongoose.model("ParkingSpace",parkingSpaceSchema)

module.exports = ParkingSpace
