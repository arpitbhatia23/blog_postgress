import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieParser());

// routes
import userRouter from "./router/user.routes.js";
import postRouter from "./router/post.routes.js";

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

export { app };
