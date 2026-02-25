import { Router } from "express";
import { 
    createComment, 
    getPostComments, 
    deleteComment 
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/post/:post_id").get(getPostComments);

// Secured routes
router.route("/post/:post_id").post(verifyJwt, createComment);
router.route("/:comment_id").delete(verifyJwt, deleteComment);

export default router;
