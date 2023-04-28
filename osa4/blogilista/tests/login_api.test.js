const supertest = require("supertest");

const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("login", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await api.post("/api/users").send(helper.initialUsers[0]);
  });

  test("login successful with correct credetials", async () => {
    await api.post("/api/login").send(helper.initialUsers[0]).expect(200);
  });

  test("login not successful with incorrect password", async () => {
    const incorrectUserCreds = {
      username: helper.initialUsers[0].username,
      password: "wrong",
    };

    await api.post("/api/login").send(incorrectUserCreds).expect(401);
  });
});
