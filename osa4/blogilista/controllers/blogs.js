const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = await new Blog(request.body);

  blog.user = await User.findOne({});
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  let blog;
  try {
    blog = structuredClone(request.body);
  } catch {
    next({ name: "InvalidRequest" });
  }

  const modifiedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(modifiedBlog);
});

module.exports = blogsRouter;
