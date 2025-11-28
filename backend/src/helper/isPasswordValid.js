import bcrypt from "bcryptjs";
export const isPasswordVaild = async (user_password, password) => {
  return await bcrypt.compare(password, user_password);
};
