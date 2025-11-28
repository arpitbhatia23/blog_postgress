import jwt from "jsonwebtoken";
export async function refreshTokenGenerator(user_id) {
  return jwt.sign(
    {
      id: user_id,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRY,
    }
  );
}
