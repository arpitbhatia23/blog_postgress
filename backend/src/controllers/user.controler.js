import { Users } from "../db/schema/user.schema.js";
import { db } from "../db/index.js";
import { asynchandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apierror.js";
import { apiResponse } from "../utils/apiresponse.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { isPasswordVaild } from "../helper/isPasswordValid.js";
import { accessTokenGenerator } from "../helper/accestokengenerator.js";
import { refreshTokenGenerator } from "../helper/refreshtokengenerator.js";
const generateAccessTokenAndRefreshToken = async (userID) => {
  try {
    // Fetch the user
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userID))
      .limit(1);

    if (!user[0]) throw new Error("User not found");

    const currentUser = user[0];

    // Generate tokens
    const accessToken = await accessTokenGenerator(
      currentUser.id,
      currentUser.email,
      currentUser.username
    );
    const refreshToken = await refreshTokenGenerator(currentUser.id);

    // Save refresh token in DB
    await db
      .update(Users)
      .set({ refresh_token: refreshToken }) // make sure `refreshToken` column exists in your Users table
      .where(eq(Users.id, userID));

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong while generating access and refresh token"
    );
  }
};

export default generateAccessTokenAndRefreshToken;

const registerUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field.trim === "")) {
    throw new apiError(400, "all field arae required");
  }

  const isUserExist = await db
    .select()
    .from(Users)
    .where(or(eq(Users.email, email), eq(Users.username, username)));

  if (isUserExist.length > 0) {
    throw new apiError(400, "user exits");
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  const [newuser] = await db
    .insert(Users)
    .values({ username, email, password: encryptedPassword })
    .returning();

  if (!newuser) {
    throw new apiError(500, "somethign went wrong while registering user");
  }
  return res.status(200).json(
    new apiResponse(
      200,
      {
        user: newuser.id,
        emai: newuser.email,
        username: newuser.username,
      },
      "user register sucefully"
    )
  );
});

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    throw new apiError(400, "email and password required");
  }

  const user = await db.select().from(Users).where(eq(Users.email, email));
  if (user.length == 0) {
    throw new apiError(404, "user not found");
  }
  const isPassvaild = isPasswordVaild(user[0].password, password);
  if (!isPassvaild) {
    throw new apiError(400, "invalid password");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user[0].id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, {
        user: user[0],
        accessToken: accessToken,
        refreshToken: refreshToken,
      })
    );
});

const logout = asynchandler(async (req, res) => {
  const { id } = req.user;

  const user = await db
    .update(Users)
    .set({ refresh_token: null })
    .where(eq(Users.id, id));
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "user logout sucessfully"));
});

export { registerUser, login, logout };
