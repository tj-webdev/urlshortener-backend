const express = require('express');
const shortUrlController = require('../controllers/shortUrlController');
const {userLogin} = require('../middlewares/userAuth');

const router = express.Router();

router
.post('/shorturl', userLogin, shortUrlController.createShortUrl)
.get('/getshorturl', userLogin, shortUrlController.getShortUrl)
.get('/shorturl/analytics/:id', userLogin, shortUrlController.getAnalytics)
.get('/:shorturl', shortUrlController.redirectShortUrl)


module.exports = router;