"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const zap_1 = require("./router/zap");
const cors_1 = __importDefault(require("cors"));
const trigger_1 = require("./router/trigger");
const actions_1 = require("./router/actions");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/zap", zap_1.zapRouter);
app.use("/api/v1/trigger", trigger_1.triggerRouter);
app.use("/api/v1/action", actions_1.actionRouter);
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(3002);
