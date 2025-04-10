"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    try {
        const payload = jsonwebtoken_1.default.verify(token, "hello");
        //@ts-ignore
        req.id = payload.id;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
exports.authMiddleware = authMiddleware;
