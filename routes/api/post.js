const express = require('express');
const router = express.Router();


//@route  GET api/v1/post/
//@desc   boilerplate for the desc
//@access Public

router.get('/', (req, res) => {
    res.send('Hello!')
})

module.exports = router;