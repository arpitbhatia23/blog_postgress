import test from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import { accessTokenGenerator } from "../src/helper/accestokengenerator.js";

// Set environment variables for testing
process.env.JWT_SECRET = "mysecret";
process.env.JWT_EXPIRY = "1h";

test("accessTokenGenerator creates a valid JWT", async () => {
  const userData = {
    user_id: 123,
    email: "test@example.com",
    username: "tester",
  };
  const token = await accessTokenGenerator(
    userData.user_id,
    userData.email,
    userData.username
  );

  assert.ok(token); // token exists
  assert.strictEqual(typeof token, "string");

  // Decode the token to check payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert.strictEqual(decoded.id, userData.user_id);
  assert.strictEqual(decoded.email, userData.email);
  assert.strictEqual(decoded.username, userData.username);
});

test("accessTokenGenerator respects expiry", async () => {
  const token = await accessTokenGenerator(1, "a@b.com", "user");

  const decoded = jwt.decode(token, { complete: true });
  assert.ok(decoded.payload.exp); // expiry exists
  assert.ok(decoded.payload.exp > Math.floor(Date.now() / 1000));
});
