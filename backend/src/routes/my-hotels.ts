import express, { Request, Response } from "express"
import multer from 'multer'
import cloudinary from "cloudinary"
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";
const myHotelRoutes = express.Router()

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 mb 
    }
})

myHotelRoutes.post("/",
    verifyToken,
    upload.array("imageFiles", 6),
    [
        //will only run this logic, if the request is from the registered user with verified token
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("country").notEmpty().withMessage('Country is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel type is required'),
        body("pricePerNight").notEmpty().isNumeric().withMessage('Price per night is required'),
        body("facilities").notEmpty().isArray().withMessage('Facilities are required'),

    ],

    
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("the error created is:", errors.array());

            return res.status(400).json({ errors: errors.array() });

        }
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            //1. upload the images to cloudinary 
            //imageFiles is an array which contains files, now the map method is used to create a different array\
            //which will contain the url of the images sent from the cloudinary as that will store the images 
            //uploadPromises is the array created by the maps,which contains the urls 
           const imageUrls= await uploadImages(imageFiles);

            //wait till the upload is completed 
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;
            //add the url to the new hotel 
            //save the hotel in our db 
   
            const hotel = new Hotel(newHotel)
            await hotel.save();
            //return 201 status 
            res.status(201).send(hotel);
        } catch (error) {
            console.log("Error creating hotel: ", error);
            res.status(500).json({ message: "Something went wrong" });

        }
    })


async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI)
        return res.url;
    })
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default myHotelRoutes; 