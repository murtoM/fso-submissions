import PropTypes from "prop-types";

import Blog from "./Blog";

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

export default BlogList;
