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

module.exports = { dummy, totalLikes, favouriteBlog };
