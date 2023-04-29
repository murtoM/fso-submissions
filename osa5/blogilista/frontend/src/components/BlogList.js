import { useState } from "react";

const BlogList = ({ blogs, likeBlog }) => (
  <div>
    <h2>blogs</h2>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} likeBlog={likeBlog} />
    ))}
  </div>
);

const Blog = ({ blog, likeBlog }) => {
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
    likeBlog(blog.id);
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
      </div>
    </div>
  );
};

export default BlogList;
