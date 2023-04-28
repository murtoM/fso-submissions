const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await api.post("/api/users").send(helper.initialUsers[0]);
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("correct number of blogs is returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("returned blog has `id` instead of `_id`", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0]._id).not.toBeDefined();
    expect(response.body[0].id).toBeDefined();
  });

  test("another blog can be added", async () => {
    const user = (await helper.usersInDb())[0];
    const newBlog = helper.additionalBlog;
    newBlog.userId = user.id;

    const blogCountBeforePost = (await helper.blogsInDb()).length;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const blogsAtEnd = await helper.blogsInDb();
    const blogCountAfterPost = blogsAtEnd.length;
    expect(blogCountAfterPost).toBe(
      blogCountBeforePost ? blogCountBeforePost + 1 : 1
    );

    const authors = response.body.map((r) => r.author);
    expect(authors).toContain(helper.additionalBlog.author);
  });

  test("an existing blog can be modified", async () => {
    const existingBlog = (await helper.blogsInDb())[0];
    const modifiedBlogToPut = structuredClone(existingBlog);
    modifiedBlogToPut.likes++;
    delete modifiedBlogToPut.id;

    const response = await api
      .put(`/api/blogs/${existingBlog.id}`)
      .send(modifiedBlogToPut);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject(modifiedBlogToPut);

    const modifiedBlog = (await helper.blogsInDb()).find(
      (blog) => blog.author === existingBlog.author
    );

    expect(modifiedBlog.likes).toBe(existingBlog.likes + 1);
  });

  test("trying to modify non existing blog returns 400", async () => {
    let nonExistingBlog = {
      title: "Doesnt exist",
      author: "this doesnt either",
    };

    await api
      .put(`/api/blogs/${await helper.nonExistingId}`)
      .send(nonExistingBlog)
      .expect(400);
  });
});

describe("when there is no initial blogs", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await api.post("/api/users").send(helper.initialUsers[0]).expect(201);
  });

  test("an empty list is returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toEqual([]);
  });

  test("a valid blog can be added", async () => {
    const user = (await helper.usersInDb())[0];
    const newBlog = helper.initialBlogs[0];
    newBlog.userId = user.id;

    const blogCountBeforePost = (await helper.blogsInDb()).length;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const blogsAtEnd = await helper.blogsInDb();
    const blogCountAfterPost = blogsAtEnd.length;
    expect(blogCountAfterPost).toBe(
      blogCountBeforePost ? blogCountBeforePost + 1 : 1
    );

    const authors = response.body.map((r) => r.author);
    expect(authors).toContain(helper.initialBlogs[0].author);
  });

  test("added blog has the correct user", async () => {
    const user = (await helper.usersInDb())[0];
    const newBlog = helper.initialBlogs[1];
    newBlog.userId = user.id;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const addedBlog = response.body.find(
      (blog) => blog.author === helper.initialBlogs[1].author
    );

    delete user.blogs;
    expect(addedBlog.user).toEqual(user);
  });

  test("blog without likes value is assigned 0 likes", async () => {
    const user = (await helper.usersInDb())[0];
    const newBlogWithoutLikes = {
      title: "Blog with no likes",
      author: "An author",
      url: "the url",
      userId: user.id,
    };

    await api
      .post("/api/blogs")
      .send(newBlogWithoutLikes)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd.find(
      (blog) => blog.title === newBlogWithoutLikes.title
    ).likes;
    expect(likes).toBe(0);
  });

  test("posting blog with no title or url returns 400 Bad Request", async () => {
    const user = (await helper.usersInDb())[0];
    const blogWithNoTitle = {
      author: "An author which cannot write titles",
      url: "but can provide an url",
      likes: 0,
      userId: user.id,
    };

    await api
      .post("/api/blogs")
      .send(blogWithNoTitle)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect(400);

    const blogWithNoUrl = {
      title: "Title for urlless blog",
      author: "An author which cannot provide urls",
      likes: 0,
      userId: user.id,
    };

    await api
      .post("/api/blogs")
      .send(blogWithNoUrl)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect(400);
  });

  test("posting without valid token returns 401", async () => {
    const blog = helper.additionalBlog;

    await api.post("/api/blogs").send(blog).expect(401);
  });
});

describe("after one blog have been posted", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await api.post("/api/users").send(helper.initialUsers[0]).expect(201);

    const user = (await helper.usersInDb())[0];
    const newBlog = helper.initialBlogs[0];
    newBlog.userId = user.id;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", await helper.loginAndGetToken(user.username, api))
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const username = (await User.findById(blogToDelete.user)).username;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", await helper.loginAndGetToken(username, api))
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const authors = blogsAtEnd.map((r) => r.author);

    expect(authors).not.toContain(blogToDelete.author);
  });

  test("blog deletion without valid token returns 401", async () => {
    const id = (await helper.blogsInDb())[0].id;

    await api.delete(`/api/blogs/${id}`).expect(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
