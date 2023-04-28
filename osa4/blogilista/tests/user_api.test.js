const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const User = require("../models/user");
const testHelper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

describe("when there is no users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("an empty list is returned", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toEqual([]);
  });

  test("a valid new user can be created", async () => {
    const response = await api
      .post("/api/users")
      .send(testHelper.newUser)
      .expect(201);

    const savedUser = response.body;
    expect(savedUser.name).toBe(testHelper.newUser.name);
    expect(savedUser.username).toBe(testHelper.newUser.username);
  });
});

describe("when there is couple of users", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    for (const user of testHelper.initialUsers) {
      await api.post("/api/users").send(user).expect(201);
    }
  });

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("getting users return returns correct number of users", async () => {
    const response = await api.get("/api/users").expect(200);

    expect(response.body.length).toBe(testHelper.initialUsers.length);
  });

  test("getting users returns users in with `id` instead of `_id`", async () => {
    const response = await api.get("/api/users").expect(200);
    expect(response.body[0]._id).not.toBeDefined();
    expect(response.body[0].id).toBeDefined();
  });

  test("a valid new user can be created", async () => {
    const response = await api
      .post("/api/users")
      .send(testHelper.newUser)
      .expect(201);

    const savedUser = response.body;
    expect(savedUser.name).toBe(testHelper.newUser.name);
    expect(savedUser.username).toBe(testHelper.newUser.username);

    const users = await testHelper.usersInDb();
    const usernames = users.map((user) => user.username);

    expect(usernames).toContain(testHelper.newUser.username);
  });

  test("invalid user returned 400", async () => {
    const userWithoutUsername = { password: "sekret" };
    const userWithoutPassword = { username: "new_username" };
    const userWithShortUserName = { username: "ad", password: "sekret" };
    const userWithShortPassword = { username: "new_username1", password: "se" };

    let response = await api
      .post("/api/users")
      .send(userWithoutUsername)
      .expect(400);
    expect(response.body.error).toBe(
      "User validation failed: username: Path `username` is required."
    );

    response = await api
      .post("/api/users")
      .send(userWithoutPassword)
      .expect(400);
    expect(response.body.error).toBe("Password was not provided");

    response = await api
      .post("/api/users")
      .send(userWithShortUserName)
      .expect(400);
    expect(response.body.error).toBe(
      `User validation failed: username: Path \`username\` (\`${userWithShortUserName.username}\`) is shorter than the minimum allowed length (3).`
    );

    response = await api
      .post("/api/users")
      .send(userWithShortPassword)
      .expect(400);
    expect(response.body.error).toBe(
      "Password should be atleast 3 characters long"
    );
  });

  test("user that already is created is not valid, returns 400", async () => {
    const response = await api
      .post("/api/users")
      .send(testHelper.initialUsers[0])
      .expect(400);

    expect(response.body.error).toBe(
      `User validation failed: username: Error, expected \`username\` to be unique. Value: \`${testHelper.initialUsers[0].username}\``
    );
  });

  test("when few blogs are added, the correct user has them", async () => {
    const firstUser = (await testHelper.usersInDb())[0];
    for (const initialBlog of testHelper.initialBlogs) {
      initialBlog.userId = firstUser.id;
      await api.post("/api/blogs").send(initialBlog).expect(201);
    }

    const response = await api.get("/api/users").expect(200);

    const user = response.body.find(
      (user) => user.username === firstUser.username
    );

    const blogs = await testHelper.blogsInDb();
    for (const blog of blogs) {
      delete blog.likes;
      delete blog.user;
      expect(user.blogs).toContainEqual(blog);
    }
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
