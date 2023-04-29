import { useState } from "react";

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const buttonLabel = detailsVisible ? "hide" : "view";

  const handleClick = (event) => {
    setDetailsVisible(!detailsVisible);
  };

  const blogStyle = {
    paddintTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={handleClick}>{buttonLabel}</button>
      <div style={{ display: detailsVisible ? "" : "none" }}>
        {blog.url}
        <br />
        {blog.likes} <button>like</button>
        <br />
        {blog.user.name}
        <br />
      </div>
    </div>
  );
};

export default BlogList;
