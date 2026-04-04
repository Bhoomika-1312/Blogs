const Blog = require('../models/blog');

async function getHomePage(req, res) {
  const allblogs = await Blog.find({})
    .populate('createdBy', 'fullName profilePicture')
    .sort({ createdAt: -1 })
    .lean();
  return res.render('home', {
    user: req.user,
    blogs: allblogs,
  });
}

module.exports = {
  getHomePage,
};
