const blogsRouter = require("express").Router();

const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = await request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = await request.user;
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user.id.toString())
    await Blog.findByIdAndDelete(request.params.id);
  else response.status(401).end();

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
