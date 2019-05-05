const multer = require('multer');
var path = require('path');

// Multer Configuration
const multerConf = {
  storage: multer.diskStorage({
    destination: function(req, file, next) {
      next(null, './public/img');
    },
    filename: function(req, file, next) {
      const ext = file.mimetype.split('/')[1];
      next(null, req.user.id + '_' + Date.now() + '.' + ext);
    }
  }),
  fileFilter: function(req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      next(null, true);
    } else {
      next({ message: 'File type not supportted' }, false);
    }
  }
};

module.exports = multer(multerConf);
