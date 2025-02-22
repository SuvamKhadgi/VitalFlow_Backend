const express = require('express');
const { signUp, login, uploadImage,getuser } = require('../controller/creadController');
const router = express.Router();
const upload = require("../middleware/uploads");
const { authorization } = require('../security/auth');


// const uploadImage = require("../controller/creadController");


// router.post('/signup', upload.single('profile_picture'), signUp); // Profile picture upload
router.post('/login', login);
router.post("/uploadImage", upload, uploadImage);
router.post('/signup', signUp);
router.get('/getuser',authorization,getuser)

module.exports = router;
