exports.index = function(req, res) {
  return res.redirect('/login');
};

exports.dashboard = function(req, res) {
  if (req.user) {
    res.render('home');
  }else{
    return res.redirect('/login');
  }
};

exports.getLogin = function(req, res) {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('home');
};