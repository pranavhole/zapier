import { Router } from "express";
import { prismaClient } from "../db";

const router = Router(); 

router.get("/available",async(req,res)=>{
    const availableAction= await prismaClient.availableAction.findMany({});
    res.json({
        availableAction
    })
})

export const actionRouter = router;