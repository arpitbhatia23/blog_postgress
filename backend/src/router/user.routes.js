import { Router } from "express";
import {
  changePassword,
  login,
  logout,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(verifyJwt, logout);
router.route("/changePassword").patch(verifyJwt, changePassword);

export default router;
