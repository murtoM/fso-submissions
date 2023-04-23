const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

describe("blog api get", () => {
  beforeEach(async () => {
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
});

describe("blog api post", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
  });

  test("a valid blog can be added", async () => {
    const newBlog = helper.initialBlogs[0];

    const blogCountBeforePost = (await helper.blogsInDb()).length;

    await api
      .post("/api/blogs")
      .send(newBlog)
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

  test("blog without likes value is assigned 0 likes", async () => {
    const newBlogWithoutLikes = {
      title: "Blog with no likes",
      author: "An author",
      url: "the url",
    };

    await api
      .post("/api/blogs")
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd.find(
      (blog) => blog.title === newBlogWithoutLikes.title
    ).likes;
    expect(likes).toBe(0);
  });

  test("posting blog with no title or url returns 400 Bad Request", async () => {
    const blogWithNoTitle = {
      author: "An author which cannot write titles",
      url: "but can provide an url",
      likes: 0,
    };

    await api.post("/api/blogs").send(blogWithNoTitle).expect(400);

    const blogWithNoUrl = {
      title: "Title for urlless blog",
      author: "An author which cannot provide urls",
      likes: 0,
    };

    await api.post("/api/blogs").send(blogWithNoUrl).expect(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
