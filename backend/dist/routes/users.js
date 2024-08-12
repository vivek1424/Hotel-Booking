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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRouter = express_1.default.Router();
const express_validator_1 = require("express-validator");
userRouter.post("/register", [
    (0, express_validator_1.check)("firstName", "First name is required").isString(),
    (0, express_validator_1.check)("lastName", "Last name is required").isString(),
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        let user = yield user_model_1.default.findOne({
            email: req.body.email
        });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        user = new user_model_1.default(req.body);
        //before saving this a middleware is added in the user.model.ts file 
        //which encrypts the password if there is any modification 
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).send({ message: "User registered OK" });
    }
    catch (error) {
        //logging the error in the backend 
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
exports.default = userRouter;
