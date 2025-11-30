import { asynchandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiresponse.js";
import { apiError } from "../utils/apierror.js";
import { uploadOnCloudinary } from "../utils/cloudnairy.js";
import { db } from "../db/index.js";
import { Posts } from "../db/schema/post.schema.js";
import { and, desc, eq, or } from "drizzle-orm";
import { Users } from "../db/schema/user.schema.js";
const createPost = asynchandler(async (req, res) => {
  const { title, content, published } = req.body;
  const user = req.user;

  if ([title, content, published].some((filed) => filed.trim() == "")) {
    throw new apiError(400, "all field are required");
  }

  let imagePath = "";
  if (req.file) {
    imagePath = req.file?.path;
  }
  let image_url = "";

  if (imagePath) {
    image_url = await uploadOnCloudinary(imagePath);
  }
  console.log(image_url);
  const post = await db
    .insert(Posts)
    .values({
      title: title.trim(),
      content: content.trim(),
      author_id: user.id,
      published: published,
      image_url: image_url?.secure_url,
    })
    .returning();

  if (!post[0]) {
    throw new apiError(400, "something went wrong while creating post");
  }

  return res
    .status(200)
    .json(new apiResponse(200, post, "post created successfuly"));
});

const updatePost = asynchandler(async (req, res) => {
  const { title, content, published } = req.body;
  const user = req.user;
  const { post_id } = req.params;

  if ([title, content, published].some((fileds) => fileds.trim() === "")) {
    throw new apiError(400, "all field are required");
  }
  let image_path = "";

  if (req.file) {
    image_path = req.file?.path;
  }
  let image_url = "";
  if (image_path) {
    image_url = await uploadOnCloudinary(image_path);
  }

  const updatePost = await db
    .update(Posts)
    .set({
      title: title,
      content: content,
      published: published,
      image_url: image_url.secure_url,
    })
    .where(eq(Posts.id, post_id))
    .returning();

  return res
    .status(200)
    .json(new apiResponse(200, updatePost, "post updated sucessfully"));
});

const get_all_post = asynchandler(async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const offset = Number((page - 1) * limit);

  console.log(page, limit, offset);
  const posts = await db
    .select()
    .from(Posts)
    .orderBy(desc(Posts.created_At))
    .limit(limit)
    .offset(offset);

  if (posts.length == 0) {
    throw new apiError(404, "posts not available");
  }

  return res
    .status(200)
    .json(new apiResponse(200, posts, "post fetch sucessfully"));
});

const get_user_post = asynchandler(async (req, res) => {
  const user = req.user;
  const post = await db
    .select()
    .from(Posts)
    .where(eq(Posts.author_id, user.id));
  if (post.length == 0) {
    throw new apiError(404, "post not found");
  }

  res.status(200).json(new apiResponse(200, post, "post fetched sucessfully"));
});

const get_post_by_id = asynchandler(async (req, res) => {
  const { post_id } = req.params;

  const post = await db.select().from(Posts).where(eq(Posts.id, post_id));

  if (post.length == 0) {
    throw new apiError(404, "post not found");
  }
  res.status(200).json(new apiResponse(200, post, "post fetch sucessfully"));
});

const delete_post_by_id = asynchandler(async (req, res) => {
  const { post_id } = req.params;
  if (!post_id) {
    throw new apiError(400, "post id is required");
  }
  const user = req.user;
  await db
    .delete(Posts)
    .where(and(eq(Posts.id, post_id), eq(Posts.author_id, user.id)));

  return res
    .status(200)
    .json(new apiResponse(200, {}, "post delet succesfully"));
});

export {
  createPost,
  updatePost,
  get_all_post,
  get_user_post,
  get_post_by_id,
  delete_post_by_id,
};
