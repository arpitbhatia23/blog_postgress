import express from "express";
import { checkdb, db } from "./src/db/index.js";
import { app } from "./src/app.js";
app.use(express.json());

const port = process.env.PORT;

checkdb();

console.log(port);
app.listen(port, "0.0.0.0", () => {
  console.log(`API running at http://localhost:${port}`);
});
