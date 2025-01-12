const mongoose = require("mongoose")
const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer' 
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
    
})

//automatically update `updatedAt` field on document save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  

const User = mongoose.model("User",userSchema)

module.exports = User
