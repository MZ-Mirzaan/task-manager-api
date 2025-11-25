const request = require("supertest");
const app = require("../src/app");
require("./setup");

let token;
let taskId;

describe("Tasks API Tests", () => {
  beforeAll(async () => {
    // create user + login
    const user = { email: "taskuser@example.com", password: "password123" };

    await request(app).post("/api/auth/register").send(user);

    const loginRes = await request(app).post("/api/auth/login").send(user);
    token = loginRes.body.token;
  });

  // 1. CREATE TASK
  test("Create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Write tests",
        description: "Jest test case",
        status: "pending"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");

    taskId = res.body.id;
  });

  // 2. GET TASK LIST
  test("Get paginated task list", async () => {
    const res = await request(app)
      .get("/api/tasks?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  // 3. GET SINGLE TASK
  test("Get a single task", async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  // 4. UPDATE TASK
  test("Update a task status", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  // 5. DOES NOT ALLOW ACCESS WITHOUT TOKEN
  test("Reject request without JWT token", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(401);
  });

  // 6. DELETE TASK
  test("Delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
