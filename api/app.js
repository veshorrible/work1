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
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
var Donation = require('./models/donation')
var express = require('express')
var bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
app.use(cors())

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { 'test': 'test' }
}))

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/donations', function (req, res) {
    var options = {};
    if (req.query.donor_id) {
        options.donor_id = req.query.donor_id;
    }
    if (req.query.donor_name) {
        let donor_name = req.query.donor_name;
        if (donor_name != 'anonymous') {
            options.donor_name = req.query.donor_name;

        }
        else {
            options.donor_name = { $eq: ''}
        }
    }
    if (req.query.donor_email) {
        options.donor_email = req.query.donor_email;
    }
    if (req.query.donor_gender) {
        options.donor_gender = req.query.donor_gender;
    }
    if (req.query.donor_address) {
        options.donor_address = req.query.donor_address;
    }
    if (req.query.donation_amount) {
        options.donation_amount = req.query.donation_amount;
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

global.__basedir = __dirname;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};
const upload = multer({ storage: storage, fileFilter: csvFilter });

app.post('/api/upload-csv-file', upload.single("file"), (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a CSV file!"
            });
        }
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", async () => {
                let successImportedCount = 0;
                let errorImportedCount = 0;
                for(let donationRecord of csvData) {
                    var options = {
                        donor_id: donationRecord['donor_id'],
                        donor_name: donationRecord['donor_name'],
                        donor_email: donationRecord['donor_email'],
                        donor_gender: donationRecord['donor_gender'],
                        donor_address: donationRecord['donor_address'],
                        donation_amount: donationRecord['donation_amount']
                    }
                    var donation = new Donation(options);
                    await donation.save()
                        .then(function (new_donation) {
                            successImportedCount++
                        })
                        .catch(function (err) {
                            errorImportedCount++
                        });
                }

                res.status(200).send({
                    'success': successImportedCount,
                    'error': errorImportedCount,
                    'total': successImportedCount + errorImportedCount
                });
            });
    } catch (error) {
        console.log("catch error-", error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
});

app.listen(3333)