import { asynchandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiresponse.js";
import { apiError } from "../utils/apierror.js";
import { uploadOnCloudinary } from "../utils/cloudnairy.js";
import { db } from "../db/index.js";
import { Posts } from "../db/schema/post.schema.js";
import { and, desc, eq, or } from "drizzle-orm";
import { Comments } from "../db/schema/comment.schema.js";
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

  // Fetch post with comments
  const rows = await db
    .select({
      post_id: Posts.id,
      post_title: Posts.title,
      post_content: Posts.content,
      comment_id: Comments.id,
      comment_text: Comments.content,
      comment_user: Comments.author_id,
    })
    .from(Posts)
    .leftJoin(Comments, eq(Comments.post_id, Posts.id))
    .where(eq(Posts.id, post_id));
  // Post not found
  if (!rows || rows.length === 0) {
    throw new apiError(404, "Post not found");
  }

  // Structure post with comments array
  const post = {
    id: rows[0].post_id,
    title: rows[0].post_title,
    content: rows[0].post_content,
    comments: rows
      .filter((row) => row.comment_id !== null)
      .map((row) => ({
        id: row.comment_id,
        text: row.comment_text,
        user_id: row.comment_user,
      })),
  };

  res.status(200).json(new apiResponse(200, post, "Post fetched successfully"));
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
