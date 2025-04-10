import express from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
const app = express();

app.use(express.json());
const client = new PrismaClient();




app.post("/hooks/catch/:userId/:zapId", async(req,res)=>{
    const userId = req.params.userId;
    const zapId= req.params.zapId;
    const body = req.body;
    console.log(body)
    await client.$transaction(async (tx) => {
        const run=await  client.zapRun.create({
            data :{
                zapId:zapId,
                metaData : body
            }
        });
        await client.zapRunOutbox.create({
            data:{
                zapRunId: run.id
            }
        })
    })

    res.json("data collected")
})
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

// post()