import { asynchandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiresponse.js";
import { apiError } from "../utils/apierror.js";
import { db } from "../db/index.js";
import { Comments } from "../db/schema/comment.schema.js";
import { eq } from "drizzle-orm";

const createComment = asynchandler(async (req, res) => {
  const { content } = req.body;
  const { post_id } = req.params;
  const user = req.user;

  if (!content || content.trim() === "") {
    throw new apiError(400, "Comment content is required");
  }

  const comment = await db
    .insert(Comments)
    .values({
      content: content.trim(),
      post_id: parseInt(post_id),
      author_id: user.id,
    })
    .returning();

  if (!comment[0]) {
    throw new apiError(500, "Something went wrong while creating comment");
  }

  return res
    .status(201)
    .json(new apiResponse(201, comment[0], "Comment created successfully"));
});

const getPostComments = asynchandler(async (req, res) => {
  const { post_id } = req.params;

  const comments = await db
    .select()
    .from(Comments)
    .where(eq(Comments.post_id, parseInt(post_id)));

  return res
    .status(200)
    .json(new apiResponse(200, comments, "Comments fetched successfully"));
});

const deleteComment = asynchandler(async (req, res) => {
  const { comment_id } = req.params;
  const user = req.user;

  const comment = await db
    .select()
    .from(Comments)
    .where(eq(Comments.id, parseInt(comment_id)))
    .limit(1);

  if (!comment[0]) {
    throw new apiError(404, "Comment not found");
  }

  if (comment[0].author_id !== user.id) {
    throw new apiError(403, "You are not authorized to delete this comment");
  }

  await db.delete(Comments).where(eq(Comments.id, parseInt(comment_id)));

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Comment deleted successfully"));
});

export { createComment, getPostComments, deleteComment };
