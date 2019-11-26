require('dotenv').config();
const express = require('express'),
    app = express();
const parser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const endpoint = process.env.API_ENDPOINT || 'localhost';

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views/pages'));

app.get("/meeting/create", (req, res) => {
    res.render("newmeeting");
});

app.get("/meeting/checkout", (req, res) => {
    res.render("meetingcheckout", {
        status: ''
    });
});

app.post("/meeting/new", (req, res) => {
    let meetingData = {
        visitor: {
            name: req.body.visitorName,
            email: req.body.visitorEmail,
            phone: req.body.visitorPhone,
            checkinTime: req.body.visitorCheckinTimeDate + 'T' + req.body.visitorCheckinTimeTime,
            checkoutTime: req.body.visitorCheckoutTimeDate + 'T' + req.body.visitorCheckoutTimeTime
        },
        host: {
            name: req.body.hostName,
            email: req.body.hostEmail,
            phone: req.body.hostPhone,
            address: req.body.address
        }
    };
    console.log(meetingData);
    fetch(`http://${endpoint}:5000/api/meeting/create`, {
        method: 'POST',
        body: JSON.stringify(meetingData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(apiRes => apiRes.json())
        .then(apiRes => {
            console.log(apiRes);
            res.render('meetingcreated', {
                visitor: apiRes.details.visitor,
                host: apiRes.details.host
            });
        });
});

app.post("/meeting/checkout", (req, res) => {
    console.log(req.body.hostName);
    fetch(`http://${endpoint}:5000/api/meeting/checkout`, {
        method: 'POST',
        body: JSON.stringify({
            hostName: req.body.hostName,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(apiRes => apiRes.json())
        .then(apiRes => {
            console.log(apiRes);
            res.render('meetingcheckout', {
                status: apiRes.status
            });
        });
});

app.get("/helper", (req, res) => {
    fetch(`http://${endpoint}:5000/helper`)
        .then(result => result.json())
        .then(result => {
            console.log(result);
            res.render('helper', {
                email: result.email
            });
        });
});


app.get("/", (req, res) => {
    res.render('home');
});

app.listen(3000);