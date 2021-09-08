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
// const express = require('express')
var express = require('express')


var bodyParser = require('body-parser')


const app = express()


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


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
        });
})

app.post('/', jsonParser, function (req, res) {
    var options = {
        donor_id: req.body.donor_id,
        donor_name : req.body.donor_name,
        donor_email: req.body.donor_email,
        donor_gender: req.body.donor_gender,
        donor_address: req.body.donor_address,
        donation_amount: req.body.donation_amount,
    }
    var donation = new Donation(options);
    donation.save()
        .then(function(new_donation){
            return res.status(200).json(new_donation);
        })
        .catch(function(err){
        });

    res.status(200).json(donation);
})

app.listen(3333)