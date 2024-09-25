import express, {Request, Response} from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe"
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

export const hotelRoutes= express.Router(); 


// /api/hotels/search?
hotelRoutes.get("/search", async(req: Request, res: Response)=>{
    try {

         //if no arguments are put in find, then all documents are retrieved

         const query = constructSearchQuery(req.query);

         let sortOptions = { }
         switch (req.query.sortOption){ 
            case "starRating": 
            sortOptions= { starRating: -1 };
            break;
            case "pricePerNightAsc": 
            sortOptions = { pricePerNight : 1};
            break;
            case "pricePerNightDesc": 
            sortOptions = { pricePerNight : -1};
            break;
         }
        const pageSize =5 ; 
        //if we have page parameter, convert to string, else use the "1"
        const pageNumber = parseInt(req.query.page? req.query.page.toString(): "1")
       
        //tell to skip items, pageNUm=3, then skip (3-1)*5 (pageSize) = 10 items to be skipped  
        const skip = (pageNumber-1)*pageSize; 
        const hotels = await Hotel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);
        
        const total = await Hotel.countDocuments(query);

        const response:HotelSearchResponse = {
            data: hotels, 
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            }
        }
        res.json(response);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({message: "Something went wrong"})
    }
})



hotelRoutes.get("/:id", [
    param("id").notEmpty().withMessage("Hotel ID is required")
] ,async(req:Request,res: Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const id = req.params.id.toString();

    

    try {
        const hotel = await Hotel.findById(id).lean();    
         res.json(hotel);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error fetching hotel"})
    }
})


hotelRoutes.post("/:hotelId/bookings/payment-intent", verifyToken, async( req: Request, res: Response)=>{
    //total cost 
    //hotel id 
    //user id 
    const {numberOfNights}= req.body ; 
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);

    if(!hotel){
        return res.status(400).json({message:"Hotel not found"})
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost,
        currency:"gbp",
        metadata: {
            hotelId,
            userId: req.userId
        }
    })

    if(!paymentIntent.client_secret){
        return res.status(500).json({message: "Error creating payment intent"})
    }
    
    const response={
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost   
    };

    res.send(response)

})

hotelRoutes.post("/:hotelId/bookings", verifyToken, async(req: Request, res: Response)=>{
    try {
        const paymentIntendId= req.body.paymentIntendId; 

        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntendId as string
        )

        if(!paymentIntent){
            return res.status(400).json({message:"Payment intent not found"})
        }

        if(paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !==req.userId){
           return res.status(400).json({message: "Payment intent mismatch"}) 
        }

        if(paymentIntent.status !== "succeeded"){
            return res.status(400).json({message:`Payment intent not succeeded. Status is : ${paymentIntent.status}`})
        }

        const newBooking : BookingType = { 
            ...req.body,
            userId: req.userId
        }

        const hotel = await Hotel.findOneAndUpdate(
            {_id: req.params.hotelId},
            {
                $push: { bookings: newBooking}
            }
        )


        if(!hotel){
           return res.status(400).json({message: "hotel not found for updating booking"}) 
        }

        await hotel.save();
        res.status(200).send();

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
})


const constructSearchQuery = (queryParams : any)=>{
    let constructedQuery : any = {}

    if(queryParams.destination){
        constructedQuery.$or = [
            {city: new RegExp(queryParams.destination, "i")},
            {country: new RegExp(queryParams.destination, "i")}
        ]
    }

    if(queryParams.adultCount){
        constructedQuery.adultCount = { 
            $gte: parseInt(queryParams.adultCount)
        }
    }

    if(queryParams.childCount){
        constructedQuery.childCount = { 
            $gte: parseInt(queryParams.adultCount)
        }
    }

    if(queryParams.facilities){
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
            ? queryParams.facilities
            : [queryParams.facilities]
        }
    }

    if(queryParams.types){ 
        constructedQuery.type= { 
            $in: Array.isArray(queryParams.types)
            ? queryParams.types
            : [queryParams.types]
        }
    }

    if(queryParams.stars){ 
        const starRatings = Array.isArray(queryParams.stars) 
        ? queryParams.stars.map( (star: string)=> parseInt(star))
        : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings}
    }

    if(queryParams.maxPrice){
        constructedQuery.pricePerNight= { 
            $lte: parseInt(queryParams.maxPrice).toString()
        }
    }

    return constructedQuery;
}


export default hotelRoutes;