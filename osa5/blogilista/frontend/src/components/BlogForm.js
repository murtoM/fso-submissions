const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => (
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

export default BlogForm;
