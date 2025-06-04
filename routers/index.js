const multer  = require('multer');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const { isLoggedIn, isSeller } = require('../middlewares/middleware');
const { getDirPath, getDatePath } = require('../helpers/multerHelper');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getDirPath('uploads/' + getDatePath(new Date())));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().split('T')[0] + '-' + req.body.email + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage })



// home
router.get('/', Controller.home);

// register
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);

// login
router.get('/login', Controller.getLogin);
router.post('/login', Controller.postLogin);

// router.use(isLoggedIn);

// buyer page
router.get('/buyer/:userId/upload', Controller.getUpload);
router.post('/buyer/:userId/upload', upload.single('file'), Controller.postUpload);

router.get('/buyer/:userId/order', Controller.buyerOrderHistory);
// router.get('/buyer/:userId/order/:orderId/cancel', Controller.getCancelOrder);
router.get('/cancel/:userId/order/:orderId', Controller.getCancelOrder);

// seller page
router.get('/seller/:userId', isSeller, Controller.getSellerPage);

router.get('/seller/:userId/price/:orderId', isSeller, Controller.getSetPrice);
router.post('/seller/:userId/price/:orderId', isSeller, Controller.postSetPrice);

// set to paid
router.get('/seller/:userId/paid/:orderId', /*isSeller,*/ Controller.setToPaid);

// logout page
router.get('/logout', Controller.getLogout);

// warning page
router.get('/forbidden', Controller.getForbidden);

module.exports = router;