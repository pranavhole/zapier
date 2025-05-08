import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";


const router = Router();

router.post("/", authMiddleware, async (req: any, res: any) => {
    //@ts-ignore
    const id = req.id;
    const body = req.body;

    const parsedData = ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        })
    }
    await prismaClient.$transaction(async tx => {
        const zap = await tx.zap.create({
            data: {
                userId:id,
                triggerId: "1",
                action: {
                    create: parsedData.data.actions.map((x, index) => ({
                            actionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: x.actionMetadata,
                    }))
                }
            }
        })
        const trigger = await tx.trigger.create({
            data:{
                triggerId:parsedData.data.availableTriggerId,
                zapId:zap.id,
                
                    }
        })
        await tx.zap.update({
            where:{
                id:zap.id
            },
            data:{
                triggerId:trigger.id
            }
        })
    })
    res.send("Success")
})

router.get("/", authMiddleware,async (req:any, res:any) => {
    //@ts-ignore
    const id = req.id;
    const zaps = await prismaClient.zap.findMany({
        where:{
            userId:id
        },
        include:{
            action:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    return res.json({
        zaps
    })

})
router.get("/:zapId", authMiddleware, async(req:any, res:any) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zaps = await prismaClient.zap.findFirst({
        where:{
            userId:id,
            id:zapId
        },
        include:{
            action:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    return res.json({
        zaps
    })
})

export const zapRouter = router;