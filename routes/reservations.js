const express = require('express')
const router = express.Router()

const  { getReservations,createReservation,updateReservationStatus,deleteReservation,getReservationById} = require('../controllers/reservations.js')

// retrieve all reservations, with optional filters 
router.get('/', getReservations)

//retrieve details about a specific reservation (e.g., status, duration, user info).
router.get('/:reservationId', getReservationById)

//create a new reservation for a parking space. 
router.post('/create', createReservation)

/** example json
 * {
  "userId": "67253701686fcc4885ed8a7a",
  "parkingSpaceId": "6724e284a98d36f58baf26cd",
  "startTime": "2023-10-31T09:00:00Z",
  "endTime": "2023-10-31T11:00:00Z"
}
 */

//update the reservation’s status ("canceled" or "completed")
router.patch('/:reservationId', updateReservationStatus);
/**
 * curl -X PATCH http://localhost:8000/api/reservations/652c59ae2f59b91d01d4a5f8 \
-H "Content-Type: application/json" \
-d '{"status": "canceled"}'

 */

//cancel a reservation by deleting it
router.delete('/:reservationId', deleteReservation);


module.exports = router
