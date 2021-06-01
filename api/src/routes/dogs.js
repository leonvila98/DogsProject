const { Router } = require('express');
const router = Router();
const { getDogs, getDogDetail, postDog} = require('./controllers/dogController.js');

router.get('/',getDogs);
router.post('/',postDog);
router.get('/:idDog',getDogDetail);


module.exports = router;