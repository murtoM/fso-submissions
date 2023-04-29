import { useState, useEffect } from "react";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [notificationMessage, setNotificationMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
      setNotificationMessage("logged in successfully");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (exception) {
      setNotificationMessage("wrong username or password");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setNotificationMessage("logged out");
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setNewBlog({ author: "", title: "", url: "" });
      setNotificationMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setNotificationMessage(error.message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleBlogChange = (event) => {
    const blog = structuredClone(newBlog);
    switch (event.target.getAttribute("data-blogfield")) {
      case "author":
        blog.author = event.target.value;
        break;
      case "title":
        blog.title = event.target.value;
        break;
      case "url":
        blog.url = event.target.value;
        break;
      default:
    }
    setNewBlog(blog);
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMessage} />
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <BlogForm
            addBlog={addBlog}
            newBlog={newBlog}
            handleBlogChange={handleBlogChange}
          />
          <BlogList blogs={blogs} />
        </div>
      )}
    </div>
  );
};

export default App;
