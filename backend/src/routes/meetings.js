const express = require('express'),
    router = express.Router();
const MeetingDetails = require('../models/Meeting');
const util = require('util');

const queueName = process.env.QUEUE_NAME;

let queueChannel;

const sendToQueue = (queue, payload) => {
    queue.then(conn => {
        if (queueChannel == null) {
            queueChannel = conn.createChannel();
        }
        return queueChannel;
    }).then(channel => {
        return channel.assertQueue(queueName).then(async Ok => {
            console.log('Sent to queue');
            return channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(payload))
            );
        });
    });
}

router.post("/create", async (req, res) => {
    console.log(util.inspect(req.body));
    let meetingDetails = {
        visitor: {
            name: req.body.visitor.name,
            email: req.body.visitor.email,
            phone: req.body.visitor.phone,
            checkinTime: Date.parse(req.body.visitor.checkinTime),
            checkoutTime: Date.parse(req.body.visitor.checkoutTime)
        },
        host: {
            name: req.body.host.name,
            email: req.body.host.email,
            phone: req.body.host.phone,
            address: req.body.host.address
        }
    };
    let redis = req.redis;
    await redis.setAsync(meetingDetails.host.name, JSON.stringify(meetingDetails));
    sendToQueue(req.queue, {
        operation: "CREATE",
        data: meetingDetails
    });
    res.status(200).json({
        status: "CREATED",
        details: meetingDetails
    });
});

router.post("/checkout", async (req, res) => {
    console.log(util.inspect(req.body));
    let redis = req.redis;
    let details = await redis.getAsync(req.body.hostName);
    let meetingDetails = JSON.parse(details);
    sendToQueue(req.queue, {
        operation: "CHECKOUT",
        data: meetingDetails
    });
    res.status(200).json({
        operation: "CHECKOUT",
        status: "SUCCESSFUL",
        data: meetingDetails
    })
});

module.exports = router;