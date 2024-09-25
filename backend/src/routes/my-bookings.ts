import express, { Request, Response } from "express"
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

//api/ my-bookings
router.get("/", verifyToken, async(req: Request, res: Response)=>{
    try {
        //all the bookings of that hotel, where user's booking is present are returned
        const hotels = await Hotel.find({
            bookings: {$elemMatch : {userId: req.userId}}
        });

        //pick only the bookings of the given user 

        const results = hotels.map((hotel)=>{
            const userBookings = hotel.bookings.filter(
                (booking)=> booking.userId === req.userId
            )

            //toObject creates that into the javascript, bookings are overriden with the new userBookings which 
            //are specific to the user requesting the booking 
            const hotelWithUserBooking: HotelType ={ 
                ...hotel.toObject(),
                bookings: userBookings
            } 
            return hotelWithUserBooking;
        })

        res.status(200).send(results); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Unable to fetch bookings"})
    }
})

export default  router;