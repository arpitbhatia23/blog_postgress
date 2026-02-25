import test from "node:test";
import assert from "node:assert";
import { apiResponse } from "../src/utils/apiresponse.js"; // adjust path if needed

test("apiResponse sets properties correctly for success", () => {
  const response = new apiResponse(200, { id: 1, name: "Test" });

  assert.strictEqual(response.statusCode, 200);
  assert.deepStrictEqual(response.data, { id: 1, name: "Test" });
  assert.strictEqual(response.message, "success"); // default message
  assert.strictEqual(response.success, true); // 200 < 400
});

test("apiResponse sets properties correctly for error", () => {
  const response = new apiResponse(404, null, "Not Found");

  assert.strictEqual(response.statusCode, 404);
  assert.strictEqual(response.data, null);
  assert.strictEqual(response.message, "Not Found");
  assert.strictEqual(response.success, false); // 404 >= 400
});
