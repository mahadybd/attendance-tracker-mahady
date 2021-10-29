module.exports = (req, res, next) => {
 if (req.session.isAuth) {
  next();
 } else {
  res.redirect('/login');
 }
};

// exports.isAuth = (req, res, next) => {
//  if (req.session.isAuth) {
//   next();
//  } else {
//   req.session.error = 'Login required';
//   res.redirect('/login');
//  }
// };
