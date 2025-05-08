import { Router } from "express";
import { prismaClient } from "../db";

const router = Router(); 

router.get("/available",async(req,res)=>{
    const availableTrig =await prismaClient.availableTriggers.findMany({});
    res.json({
        availableTrig
    })
})

export const triggerRouter = router;