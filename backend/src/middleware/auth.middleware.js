import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { Users } from "../db/schema/user.schema.js";
import { apiError } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
export const verifyJwt = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "unauthorized request");
    }

    const decodetokeninfo = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.id, decodetokeninfo.id));
    if (user.length == 0) {
      console.log(401, "invalid access token");
      throw new apiError(401, "invalid access token");
    }
    req.user = user[0];
  } catch (error) {
    console.log(401, error?.message || "unauthorized request");
    throw new apiError(401, error?.message || "unauthorized request");
  }
  next();
});
