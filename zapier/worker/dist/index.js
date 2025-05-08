"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const parse_1 = require("./parse");
const email_1 = require("./email");
const prismaClient = new client_1.PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: 'zapier',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'main-worker' });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c, _d, _e, _f, _g, _h;
                if (!((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString())) {
                    return;
                }
                const parseValue = JSON.parse((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString());
                const zapRunId = parseValue.zapRunId;
                const stage = parseValue.stage;
                const zapRunDetails = yield prismaClient.zapRun.findFirst({
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
                });
                const currentAction = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.action.find(x => x.sortingOrder === stage);
                if (!currentAction) {
                    console.log("current ");
                    return;
                }
                const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metaData;
                // console.log(currentAction)
                if (currentAction.type.id === 'Email') {
                    // console.log((currentAction.metadata as JsonObject)?.amount )
                    // console.log((currentAction.metadata as JsonObject)?.email )
                    const body = (0, parse_1.parse)((_d = currentAction.metadata) === null || _d === void 0 ? void 0 : _d.body, zapRunMetadata);
                    const email = (0, parse_1.parse)((_e = currentAction.metadata) === null || _e === void 0 ? void 0 : _e.email, zapRunMetadata);
                    yield (0, email_1.sendEmail)(email, body);
                    console.log(`sending out email to ${email}  with body ${body} `);
                }
                if (currentAction.type.id === 'send-sol') {
                    // console.log((currentAction.metadata as JsonObject)?.amount )
                    const amount = (0, parse_1.parse)((_f = currentAction.metadata) === null || _f === void 0 ? void 0 : _f.amount, zapRunMetadata);
                    const address = (0, parse_1.parse)((_g = currentAction.metadata) === null || _g === void 0 ? void 0 : _g.address, zapRunMetadata);
                    console.log(`${amount} and ${address}`);
                }
                yield new Promise(resolve => setTimeout(resolve, 1000));
                const lastStage = (((_h = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.action) === null || _h === void 0 ? void 0 : _h.length) || 1) - 1; // 1
                if (lastStage !== stage) {
                    console.log("pushing back to the queue");
                    yield producer.send({
                        topic: TOPIC_NAME,
                        messages: [{
                                value: JSON.stringify({
                                    stage: stage + 1,
                                    zapRunId
                                })
                            }]
                    });
                }
                console.log("processing done");
                // 
                yield consumer.commitOffsets([{
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString() // 5
                    }]);
            }),
        });
    });
}
main();
