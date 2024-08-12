import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"


//adding the custom variable in the Request 
declare global { 
    namespace Express{
        interface Request{ 
            userId: string;
        }
    }
}

 const verifyToken = (req: Request, res: Response, next: NextFunction)=>{
    const token = req.cookies["auth_token"]

    if(!token){
        return res.status(401).json({message: "unauthorized"})
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        req.userId = (decoded as JwtPayload).userId ; 
        next(); //validate token was hanging because this was not passed earlier 
    } catch (error) {
        return res.status(401).json({message: "unauthorized"})
    }
}

export default verifyToken