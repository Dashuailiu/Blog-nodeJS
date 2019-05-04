//! Http Extension

//* add URL to session
//* wait for success redirect, like "log in"
module.exports.addReturnTo = function(req, res, next) {
  //req.session.returnTo = req.originalUrl;
  req.session.returnTo = req.headers.referrer || req.headers.referer;
  return next();
};
