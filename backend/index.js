import express from "express";
import { checkdb, db } from "./src/db/index.js";
import { app } from "./src/app.js";
app.use(express.json());

const port = process.env.PORT;

checkdb();
app.get("/api/healthcheck", (req, res) => {
  console.log("hi from server");
  res.json({ message: "Server is healthy 🚀" });
});
console.log(port);
app.listen(port, "0.0.0.0", () => {
  console.log(`API running at http://localhost:${port}`);
});
