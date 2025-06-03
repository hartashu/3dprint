const multer  = require('multer');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const { isLoggedIn, isSeller } = require('../middlewares/middleware');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })



// register
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);

// login
router.get('/login', Controller.getLogin);
router.post('/login', Controller.postLogin);

// buyer page
router.get('/buyer/upload', /*isLoggedIn,*/ Controller.getUpload);
router.post('/buyer/upload', /*isLoggedIn,*/ upload.single('photo'), Controller.postUpload);

// router.get('/buyer/order', /*isLoggedIn,*/ Controller.)

// seller page
router.get('/seller', isLoggedIn, isSeller, Controller.getSellerPage);

// logout page
router.get('/logout', isLoggedIn, Controller.getLogout);

// warning page
router.get('/forbidden', Controller.getForbidden);

module.exports = router;