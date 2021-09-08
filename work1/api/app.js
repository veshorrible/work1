var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://dennis:zaq123@cluster0.wt6es.mongodb.net/donations_db?retryWrites=true&w=majority';//замените url!!!
mongoose.connect(mongoDB, {useNewUrlParser:true}, function(error){
    if(error){
        console.log('MONGO CONNECTION ERROR',error);
        throw new Error('MongoDB Connection Error'+error);
    }
    else{
        console.log('Connected to Mongo');
    }
});

var Donation = require('./models/donation')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
    var options = {};
    if (req.query.donor_id) {
        options.donor_id = req.query.donor_id;
    }
    if (req.query.donor_name) {
        options.donor_name = req.query.donor_name;
    }
    Donation.find(options)
        .exec()
        .then(function(donations){
            return res.status(200).json(donations);
        })
        .catch(function(err){
            return res.status(500).json({status: false});
        });
})

app.get('/new', function (req, res) {
    var donation = new Donation({
        donor_id: 1111,
        donor_name: 'xxxx',
        donor_email: 'sss@gmail.com',
        donor_gender: 'm',
        donor_address: 'xxxxxx address',
        donation_amount: 200
    });
    donation.save(function (err) {
        if (err) return 'ssss'
    });

    res.status(200).json(donation);
})

app.listen(3000)