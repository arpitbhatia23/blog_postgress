import test from "node:test";
import assert from "node:assert";
import { asynchandler } from "../src/utils/asynchandler.js"; // adjust path

test("asynchandler calls next for successful route", async () => {
  let called = false;

  const req = {};
  const res = {};
  const next = () => {
    called = true;
  };

  const handler = asynchandler(async (req, res, next) => {
    // simulate async work
    await new Promise((resolve) => setTimeout(resolve, 10));
    next();
  });

  await handler(req, res, next);

  assert.strictEqual(called, true);
});

test("asynchandler catches error and sends JSON", async () => {
  let statusCode = 0;
  let jsonResponse = null;

  const req = {};
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          jsonResponse = data;
        },
      };
    },
  };
  const next = () => {};

  const errorHandler = asynchandler(async () => {
    throw { code: 400, message: "Bad Request" };
  });

  await errorHandler(req, res, next);

  assert.strictEqual(statusCode, 400);
  assert.deepStrictEqual(jsonResponse, {
    success: false,
    message: "Bad Request",
  });
});

test("asynchandler defaults status to 500 if no code", async () => {
  let statusCode = 0;
  let jsonResponse = null;

  const req = {};
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          jsonResponse = data;
        },
      };
    },
  };
  const next = () => {};

  const errorHandler = asynchandler(async () => {
    throw new Error("Server Error");
  });

  await errorHandler(req, res, next);

  assert.strictEqual(statusCode, 500);
  assert.deepStrictEqual(jsonResponse, {
    success: false,
    message: "Server Error",
  });
});
