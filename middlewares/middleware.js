const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    const errors = 'Please login first!'
    res.redirect(`/login?errors=${errors}`);
  } else {
    next();
  }
};

const isSeller = (req, res, next) => {
  if (!(req.session.user && req.session.user.role === 'seller')) {
    res.redirect('/forbidden');
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isSeller
};