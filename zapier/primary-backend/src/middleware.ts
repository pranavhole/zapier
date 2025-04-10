import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware (req:any , res : any , next : any){
    const token = req.headers.authorization as unknown as string;
    try{
    const payload = jwt.verify(token , "hello")
    
        //@ts-ignore
        req.id=payload.id
        next()
    }catch(e){
        return res.status(401).json({message:"Unauthorized"})
    
    }
}