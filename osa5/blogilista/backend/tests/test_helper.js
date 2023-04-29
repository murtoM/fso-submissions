const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const additionalBlog = {
  title: "One more blog",
  author: "Another author",
  url: "url not seen before",
  likes: 2,
};

const initialUsers = [
  {
    username: "User1",
    name: "First User",
    password: "sekret",
  },
  {
    username: "User2",
    name: "Second User",
    password: "sekret",
  },
];

const newUser = {
  username: "markus",
  name: "Markus",
  password: "sekret",
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Blog title",
    author: "Author",
    url: "url",
    likes: 1,
  });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const loginAndGetToken = async (username, api) => {
  const user = initialUsers.find((user) => user.username === username);
  const response = await api.post("/api/login").send(user);

  return `Bearer ${response.body.token}`;
};

module.exports = {
  initialBlogs,
  additionalBlog,
  initialUsers,
  newUser,
  nonExistingId,
  blogsInDb,
  usersInDb,
  loginAndGetToken,
};
