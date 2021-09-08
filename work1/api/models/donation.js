var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DonationModelSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    donor_id: { type: Number, required: true },
    donor_name: { type: String, min: 3, max: 100, required: true },
    donor_email: { type: String, min: 3, max: 20, required: true },
    donor_gender: { type: String, min: 1, max: 1, required: true },
    donor_address: { type: String, min: 10, max: 500, required: true },
    donation_amount: { type: Number, required: true },
});

module.exports = mongoose.model('donation', DonationModelSchema );
