import { Router } from "express";
import { login, logout, registerUser } from "../controllers/user.controler.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(verifyJwt, logout);

export default router;
