import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  createPost,
  delete_post_by_id,
  get_all_post,
  get_post_by_id,
  get_user_post,
  updatePost,
} from "../controllers/post.controller.js";

const router = Router();

router.route("/create").post(verifyJwt, upload.single("image"), createPost);
router
  .route("/update/:post_id")
  .post(verifyJwt, upload.single("image"), updatePost);

router.route("/getAllPost").get(verifyJwt, get_all_post);
router.route("/getUserPost").get(verifyJwt, get_user_post);
router.route("/getPostByID/:post_id").get(verifyJwt, get_post_by_id);
router.route("/deletePostById/:post_id").delete(verifyJwt, delete_post_by_id);

export default router;
