import express, { Request, Response } from 'express'
import cors from 'cors'
import "dotenv/config"
import mongoose from 'mongoose'
import userRouter from './routes/users'
import authRouter from './routes/auth'
import cookieParser from "cookie-parser"
import path from "path"
import {v2 as cloudinary} from 'cloudinary'
import myHotelRoutes from './routes/my-hotels'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    


const app = express()
//helps convert the body of api requests into json automatically and we dont have to handle 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

// app.use(express.static(path.join(__dirname, "../../frontend/dist")));
// app.get("*", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
// });


app.get("/api/test", async(req: Request, res: Response)=>{
    res.json({ message: "hello from express endpoint"})
})

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/my-hotels", myHotelRoutes)

//used while deploying code 
// app.get("*", (req: Request, res: Response)=>{
//     res.send(path.join(__dirname, '../../frontend/dist/index.html'))
// })

app.listen(7000, () => {
    console.log("server is running on localhost:7000");

})




