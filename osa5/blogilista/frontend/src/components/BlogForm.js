import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

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

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ author: "", title: "", url: "" });
  };

  return (
    <form onSubmit={addBlog}>
      <fieldset>
        <legend>New Blog</legend>
        <p>
          <label htmlFor="author">Author: </label>
          <input
            id="author"
            data-blogfield="author"
            type="text"
            value={newBlog.author}
            onChange={handleBlogChange}
          />
        </p>
        <p>
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            data-blogfield="title"
            type="text"
            value={newBlog.title}
            onChange={handleBlogChange}
          />
        </p>
        <p>
          <label htmlFor="url">URL: </label>
          <input
            id="url"
            data-blogfield="url"
            type="text"
            value={newBlog.url}
            onChange={handleBlogChange}
          />
        </p>
        <button type="submit">save</button>
      </fieldset>
    </form>
  );
};

export default BlogForm;
