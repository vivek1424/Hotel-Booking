import express, {Request, Response} from "express"
import { check, validationResult } from "express-validator"
import User from "../models/user.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import verifyToken from "../middleware/auth"

const authRouter = express.Router()

// [ 
//     check("email", "Email is required").isEmail(),
//     check("password", "Password with 6 or more characters required").isLength({min:6})
// ]

authRouter.post("/login", async (req: Request, res: Response)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ message: errors.array()})
        console.log("error in the credentials entry");
        
    }

    const {email, password}= req.body;

    try {
        const user = await User.findOne({ email})
        if(!user){
            return res.status(400).json({message: "User does not exist" })
                       
        }
        //check if the passwords match (entered one and OG one)
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Incorrect password" })
            console.log("password did not match");
            
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY as string,
            {
               expiresIn: "1d" 
            }
        )

        res.cookie("auth_token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV ==="production",
            maxAge: 86400000
        });

        res.status(200).json({userId: user._id})

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
})

authRouter.get("/validate-token", verifyToken, (req: Request, res: Response)=>{
    res.status(200).send({userId: req.userId})
})

//link, middleware and the arrow function is required 
authRouter.post("/logout", (req: Request, res: Response)=>{
    res.cookie("auth_token", "", {
        expires: new Date(0)
    })
    res.send() 
})




export default authRouter;