require('dotenv').config();
const express = require('express'),
    app = express();
const parser = require('body-parser');
const cors = require('cors');

const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(process.env.DB_URL);

const notificationQueue = require("amqplib").connect(process.env.QUEUE_URL);

const meetings = require('./routes/meetings')
const helper = require('./routes/helper');


app.use(parser.urlencoded({ extended: false }))
app.use(parser.json());
app.use(cors());

app.use("/api/meeting", (req, res, next) => {
    req.queue = notificationQueue;
    req.redis = redisClient;
    next();
}, meetings);

app.use("/helper", (req, res, next) => {
    console.log("Helping...")
    req.redis = redisClient;
    next();
}, helper);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server started.");
});