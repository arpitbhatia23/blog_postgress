import test from "node:test";
import assert from "node:assert";
import { apiError } from "../src/utils/apierror.js";

test("apiError sets custom message, statuscode and errors", () => {
  const err = new apiError(404, "Not Found", ["id missing"]);

  assert.strictEqual(err.message, "Not Found");
  assert.strictEqual(err.statuscode, 404);
  assert.strictEqual(err.success, false);
  assert.deepStrictEqual(err.errors, ["id missing"]);
  assert.ok(err.stack.includes("apiError")); // stack should include class name
});

test("apiError sets default message when not provided", () => {
  const err = new apiError(500);

  assert.strictEqual(err.message, "something went wrong");
  assert.strictEqual(err.statuscode, 500);
  assert.strictEqual(err.success, false);
  assert.deepStrictEqual(err.errors, []);
});
