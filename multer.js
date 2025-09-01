



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
  var upload = multer({ storage: storage }).single('avatar');
  
  router.post('/addNewFood', 
    function (req, res, next) {
  
      upload(req, res, function(err) {
          if (err) {
              res.redirect(req.headers.referer + "/error.html");
              return;
          }
  
          if (!req.files) {
              res.redirect(req.headers.referer + "/error.html");
              return;
          } else {
              
              res.redirect(req.headers.referer);
          }
      });
    }
  );