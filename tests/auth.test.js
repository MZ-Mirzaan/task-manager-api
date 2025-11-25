const request = require("supertest");
const app = require("../src/app");
require("./setup");

describe("Auth API Tests", () => {
  const user = {
    email: "test@example.com",
    password: "password123"
  };

  test("Register new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(user.email);
  });

  test("Login should return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
