import jwt from "jsonwebtoken";
export async function accessTokenGenerator(user_id, email, username) {
  return jwt.sign(
    {
      id: user_id,
      email: email,
      username: username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
}
