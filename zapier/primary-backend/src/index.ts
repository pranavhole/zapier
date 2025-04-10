import express, { application } from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))
app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(3002);
