import { useState } from "react";
import PropTypes from "prop-types";

const BlogList = ({ blogs, likeBlog, deleteBlog, loggedInUser }) => (
  <div>
    <h2>blogs</h2>
    {blogs.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        loggedInUser={loggedInUser}
      />
    ))}
  </div>
);

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object,
};

const Blog = ({ blog, likeBlog, deleteBlog, loggedInUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const buttonLabel = detailsVisible ? "hide" : "view";

  const blogStyle = {
    paddintTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDetailVisibilityClick = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLikeClick = async () => {
    await likeBlog(blog.id);
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      await deleteBlog(blog.id);
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={handleDetailVisibilityClick}>{buttonLabel}</button>
      <div style={{ display: detailsVisible ? "" : "none" }}>
        {blog.url}
        <br />
        {blog.likes} <button onClick={handleLikeClick}>like</button>
        <br />
        {blog.user.name}
        <br />
        {blog.user.username === loggedInUser.username && (
          <button onClick={handleDeleteClick}>remove</button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object,
};

export default BlogList;
