const mongoose = require("mongoose")
const { Schema } = mongoose;


const reservationSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parkingSpaceId: { 
        type: Schema.Types.ObjectId, 
        ref: 'ParkingSpace', 
        required: true 
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: {
         type: Date, 
         required: true 
        },
    status: {
         type: String, 
         enum: ['active', 'completed', 'canceled'], 
         default: 'active' 
        },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
  });
  
// automatically update `updatedAt` field on document save
reservationSchema.pre('save', function(next) {
this.updatedAt = Date.now();
next();
});

const Reservation = mongoose.model("Reservation",reservationSchema)

module.exports = Reservation
