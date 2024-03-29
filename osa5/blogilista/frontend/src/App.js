import { useState, useEffect, useRef } from "react";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import Toggleable from "./components/Toggleable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const compareLikeCount = (blog0, blog1) => {
    if (blog0.likes < blog1.likes) return 1;
    else if (blog0.likes > blog1.likes) return -1;
    return 0;
  };

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort(compareLikeCount)));
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
      addNotification("logged in successfully");
    } catch (exception) {
      addNotification("wrong username or password");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    addNotification("logged out");
  };

  const blogFormRef = useRef();

  const createBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisible();
      const returnedBlog = await blogService.create(newBlog);
      returnedBlog.user = user;
      setBlogs(blogs.concat(returnedBlog));
      addNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
    } catch (error) {
      addNotification(error.message);
    }
  };

  const likeBlog = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id };

    try {
      const updatedBlog = await blogService.update(id, likedBlog);
      updatedBlog.user = user;
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)));
    } catch (error) {
      console.error(error);
      addNotification(
        `Blog ${blog.title} by ${blog.author} was already removed from server`
      );
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (error) {
      console.log(error);
      addNotification(error.message);
    }
  };

  const addNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
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
          <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Toggleable>
          <BlogList
            blogs={blogs}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            loggedInUser={user}
          />
        </div>
      )}
    </div>
  );
};

export default App;
