const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    visitor: {
        type: Object,
        required: true,
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        checkinTime: {
            type: Date,
            required: true
        },
        checkoutTime: {
            type: Date,
            required: true
        }
    },
    host: {
        type: Object,
        required: true,
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('meetings', MeetingSchema, 'meetingDetails');