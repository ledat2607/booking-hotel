const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    typeUser: {
        type: String,
        enum: ['Inland', 'Foreign'],
        default: 'Inland',
        required: true,
    },
    CMND: {
        type: String,
    },
    address: {
        type: String,
    },
});

module.exports = User = mongoose.model('customers', UserSchema);
