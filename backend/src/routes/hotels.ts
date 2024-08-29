import express, {Request, Response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

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