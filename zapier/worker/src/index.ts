import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { parse } from "./parse";
import { sendEmail } from "./email";
const prismaClient = new PrismaClient();
const TOPIC_NAME = "zap-events"
const kafka = new Kafka({
    clientId: 'zapier',
    brokers: ['localhost:9092']
})

async function main() {

    const consumer = kafka.consumer({ groupId: 'main-worker' })

    await consumer.connect()
    const producer = kafka.producer();
    await producer.connect();
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })


    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          
            if (!message.value?.toString()) {
                return;
            }
            const parseValue = JSON.parse(message.value?.toString())
            const zapRunId = parseValue.zapRunId;
            const stage = parseValue.stage;


            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            action: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            })

            const currentAction = zapRunDetails?.zap.action.find(x => x.sortingOrder === stage)
            if (!currentAction) {
                console.log("current ")
                return
            }
            const zapRunMetadata = zapRunDetails?.metaData;
            // console.log(currentAction)
            if (currentAction.type.id === 'Email') {
                // console.log((currentAction.metadata as JsonObject)?.amount )
                // console.log((currentAction.metadata as JsonObject)?.email )
                    const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
                    const email = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
                    await sendEmail(email, body)
                    console.log(`sending out email to ${email}  with body ${body} `)
            }
            if (currentAction.type.id === 'send-sol') {
                // console.log((currentAction.metadata as JsonObject)?.amount )
                    const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                    const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                    console.log(`${amount} and ${address}`)
       
            }


            await new Promise(resolve => setTimeout(resolve, 1000))
            const lastStage = (zapRunDetails?.zap.action?.length || 1) - 1; // 1
            if (lastStage !== stage) {
              console.log("pushing back to the queue")
              await producer.send({
                topic: TOPIC_NAME,
                messages: [{
                  value: JSON.stringify({
                    stage: stage + 1,
                    zapRunId
                  })
                }]
              })  
            }
  
            console.log("processing done");
            // 
            await consumer.commitOffsets([{
              topic: TOPIC_NAME,
              partition: partition,
              offset: (parseInt(message.offset) + 1).toString() // 5
            }])
          },
        })
  
  }
  
  main()