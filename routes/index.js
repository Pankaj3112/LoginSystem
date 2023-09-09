const express = require('express');
const router = express.Router();

let homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.use('/users', require('./users'));

module.exports = router;