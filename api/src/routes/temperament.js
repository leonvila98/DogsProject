const { Router } = require('express');
const router = Router();
const { getTemperaments } = require('./controllers/temperamentController.js');

router.get('/',getTemperaments);


module.exports = router;
