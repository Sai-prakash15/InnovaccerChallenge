require("dotenv").config();
const workQueue = require("amqplib").connect(process.env.QUEUE_URL);

const nodemailer = require('nodemailer');
const emailFormatter = require('./emailformat');
const queueName = process.env.QUEUE_NAME;

// Taking this depedency to show emails easier. 😉
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(process.env.DB_URL);

let queueChannel;
let emailTransporter;

let checkoutMail = async (content, emailTransporter) => {
    console.log("Sending checkout mail.", content)
    let emailInfo = await emailTransporter.sendMail({
        from: '"Notification Service" <notify@ems.com>',
        to: `${content.data.visitor.email}`,
        subject: "Your Meeting Details",
        text: emailFormatter.checkoutFormat(content.data)
    });
    let emailUrl = nodemailer.getTestMessageUrl(emailInfo);
    await redisClient.setAsync('email', emailUrl);
}

let checkinMail = async (content, emailTransporter) => {
    console.log("Sending checkin mail.", content)
    let emailInfo = await emailTransporter.sendMail({
        from: '"Notification Service" <notify@ems.com>',
        to: `${content.data.host.email}`,
        subject: "Your Venue Details",
        html: emailFormatter.checkinFormat(content.data)
    });
    let emailUrl = nodemailer.getTestMessageUrl(emailInfo);
    await redisClient.setAsync('email', emailUrl);
}

workQueue
    .then(function (conn) {
        console.log("Worker running...");
        if (queueChannel == null) {
            queueChannel = conn.createChannel();
        }
        return queueChannel;
    })
    .then(channel => {
        return channel.assertQueue(queueName).then(Ok => {
            return channel.consume(queueName, async message => {
                if (message !== null) {
                    let content = JSON.parse(message.content.toString());
                    if (emailTransporter == null) {
                        emailTransporter = nodemailer.createTransport({
                            host: "smtp.ethereal.email",
                            port: 587,
                            secure: false,
                            auth: {
                                user: process.env.TEST_EMAIL,
                                pass: process.env.TEST_PASS
                            }
                        });
                    }
                    // SEND SMS.
                    if (content.operation === "CREATE") {
                        await checkinMail(content, emailTransporter);
                    } else {
                        await checkoutMail(content, emailTransporter);
                    }
                    channel.ack(message);
                }
            });
        });
    })
    .catch(console.warn);

