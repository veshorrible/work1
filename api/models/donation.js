var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DonationModelSchema = new Schema({
    donor_id: { type: Number, required: true },
    donor_name: { type: String },
    donor_email: { type: String },
    donor_gender: { type: String },
    donor_address: { type: String },
    donation_amount: { type: Number, required: true },
});

module.exports = mongoose.model('donation', DonationModelSchema );
