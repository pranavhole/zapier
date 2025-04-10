import {Router} from "express";
import { authMiddleware } from "../middleware";
import { SignupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken"

const router = Router();

router.post("/signup",async (req:any,res:any)=>{
    const body= req.body;
    const parsedData = SignupSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message :"Incorrect input"
        })
    }

    const userExist = await prismaClient.user.findFirst({
        where:{
            email : parsedData.data.username
        }
    })

    if(userExist){
        return res.status(411).json({
            message :"User already exist"
        })
    }

    await prismaClient.user.create({
        data:{
            email: parsedData.data.username,
            password: parsedData.data.password,
            name : parsedData.data.name
        }
    })
console.log("hello")
    return res.json({
        message :"User created"
    })
})


router.post("/signin",async(req:any,res:any)=>{
    const body= req.body;
    const parsedData = SignupSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message :"Incorrect input"
        })
    }
    const user = await prismaClient.user.findFirst({
        where :{
            email : parsedData.data.username
        }
    })
    if(!user){
        return res.status(403).json({
            message: "Sorry Credentails are incorrect"
        })
    }
    const token = jwt.sign({
        id: user.id
    }, "hello");
    console.log("hello")
    res.json({
        token:token
    })
})

router.get("/user", authMiddleware, async (req:any,res:any)=>{
    //@ts-ignore
    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where:{
            id
        },
        select:{
            name: true,
            email:true
        }
    })
    return res.json({
        user
    })

})

export const userRouter = router;