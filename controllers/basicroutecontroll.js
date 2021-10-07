const router = require('../routes/basicroute');

//@desc POST login
//@access Private
exports.userLogin = async (req, res, next) => {
 const { email, password } = req.body;

 const user = await UserModel.findOne({ email }).lean();

 if (!user) {
  console.log('Invalid username');
  return res.redirect('/login');
  //return res.json({ status: 'Error', error: 'Invalid user name/password' });
 }

 const isMatch = await bcrypt.compare(password, user.password);

 if (!isMatch) {
  console.log('Invalid password');
  return res.redirect('/login');
 }

 if (user) {
  req.session.userName = user.name;
  req.session.isAuth = true;
  res.redirect('/dashboard');
 }
};
