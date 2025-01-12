const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()

const PORT = process.env.PORT || 4000

const MONGOURL = process.env.MONGO_URL

const app = express();

//import routes
const reservations_routes = require('./routes/reservations.js')
const user_routes = require('./routes/users.js')
const parking_space_routes = require('./routes/parking-spaces.js')

//middleware for logging
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.path}`);
    next();
  });

//middleware for parsing incoming requests with JSON payloads
app.use(express.json())

//define routes
app.use('/api/users', user_routes)
app.use('/api/reservations', reservations_routes)
app.use('/api/parking-spaces', parking_space_routes)

//connect to database and run server 
mongoose.connect(MONGOURL).then(()=>{
    console.log('MongoDB connected !')
    app.listen(PORT,()=> {console.log('NodeJs Server Running on port ' + PORT)})

}).catch((error)=>{console.log(error)})


