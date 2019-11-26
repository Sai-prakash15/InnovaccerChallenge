const express = require('express'),
    router = express.Router();

router.get("/", async (req, res) => {
    let redis = req.redis;
    let email = await redis.getAsync('email');
    console.log(email);
    res.status(200).json({
        email: email
    });
});

module.exports = router;