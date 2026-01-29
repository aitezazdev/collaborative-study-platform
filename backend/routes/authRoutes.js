import express from "express";
import { firebaseAuth } from "../middlewares/firebaseAuth.js";
import { firebaseLogin, getUserInfo } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", firebaseAuth, firebaseLogin);
router.get("/user/info", firebaseAuth, getUserInfo);

export default router;