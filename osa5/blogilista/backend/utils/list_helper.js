const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.reduce(reducer, 0);
};

const favouriteBlog = (blogs) => {
  let blogWithMostLikes = blogs[0];
  for (const blog of blogs) {
    if (blog.likes > blogWithMostLikes.likes) {
      blogWithMostLikes = blog;
    }
  }

  return blogWithMostLikes;
};

const mostBlogs = (blogs) => {
  let listBlogCount = [];

  for (const blog of blogs) {
    let existingBlogCount = listBlogCount.find(
      (blogCount) => blogCount.author === blog.author
    );
    if (existingBlogCount) {
      existingBlogCount.blogs++;
    } else {
      listBlogCount.push({ author: blog.author, blogs: 1 });
    }
  }

  let authorWithMostBlogs = listBlogCount[0];
  for (const blogCount of listBlogCount) {
    if (blogCount.blogs > authorWithMostBlogs.blogs) {
      authorWithMostBlogs = blogCount;
    }
  }

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  let listAuthorLikes = [];

  for (const blog of blogs) {
    let existingAuthorLikes = listAuthorLikes.find(
      (authorLikes) => authorLikes.author === blog.author
    );
    if (existingAuthorLikes) {
      existingAuthorLikes.likes += blog.likes;
    } else {
      listAuthorLikes.push({ author: blog.author, likes: blog.likes });
    }
  }

  let authorWithMostLikes = listAuthorLikes[0];
  for (const authorLikes of listAuthorLikes) {
    if (authorLikes.likes > authorWithMostLikes.likes) {
      authorWithMostLikes = authorLikes;
    }
  }

  return authorWithMostLikes;
};

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
