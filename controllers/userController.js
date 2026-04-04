const User = require('../models/user');
const Blog = require('../models/blog');

function getSigninPage(req, res) {
  return res.render('signin');
}

function getSignupPage(req, res) {
  return res.render('signup');
}

async function getProfilePage(req, res) {
  if (!req.user) {
    return res.redirect('/user/signin');
  }
  const profileUser = await User.findById(req.user._id);
  if (!profileUser) {
    return res.redirect('/user/signin');
  }
  const blogCount = await Blog.countDocuments({ createdBy: profileUser._id });
  return res.render('profile', {
    user: req.user,
    profileUser,
    blogCount,
  });
}

async function updateProfile(req, res) {
  if (!req.user) return res.redirect('/user/signin');
  const { bio } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    bio: typeof bio === 'string' ? bio.trim().slice(0, 2000) : '',
  });
  return res.redirect('/user/profile');
}

async function getDashboardPage(req, res) {
  if (!req.user) return res.redirect('/user/signin');
  const myBlogs = await Blog.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  return res.render('dashboard', {
    user: req.user,
    myBlogs,
  });
}

async function getPublicProfilePage(req, res) {
  let profileUser;
  try {
    const isOwn =
      req.user && String(req.user._id) === String(req.params.id);
    profileUser = await User.findById(req.params.id).select(
      isOwn ? '-password -salt' : '-password -salt -email',
    );
  } catch {
    return res.status(404).render('not-found', { user: req.user, path: req.path });
  }
  if (!profileUser) {
    return res.status(404).render('not-found', { user: req.user, path: req.path });
  }
  const blogs = await Blog.find({ createdBy: profileUser._id })
    .sort({ createdAt: -1 })
    .lean();
  const isOwnProfile =
    req.user && String(req.user._id) === String(profileUser._id);
  return res.render('profile-public', {
    user: req.user,
    profileUser,
    blogs,
    isOwnProfile,
  });
}

async function signin(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchpasswordandgeneratetoken(email, password);
    return res.cookie('token', token).redirect('/');
  } catch (error) {
    return res.render('signin', {
      error: 'Incorrect email or password',
    });
  }
}

async function signup(req, res) {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect('/');
}

function logout(req, res) {
  return res.clearCookie('token').redirect('/');
}

module.exports = {
  getSigninPage,
  getSignupPage,
  getProfilePage,
  updateProfile,
  getDashboardPage,
  getPublicProfilePage,
  signin,
  signup,
  logout,
};
