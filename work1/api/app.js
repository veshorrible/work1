//Устанавливаем соединение с mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

// var mongoDB = 'insert_your_database_url_here';//замените url!!!
// mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const mongoose = require('mongoose');

// main().catch(err => console.log(err));
//
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/test');
// }

// var mongoose_config = {
//     "uri": "mongodb://localhost/testdb",
// }
// var mongoose_connect_string = ((process.env.MONGO_URL && process.env.MONGO_DB_NAME) ? 'mongodb://'+process.env.MONGO_URL+'/'+process.env.MONGO_DB_NAME : mongoose_config.uri);
// mongoose.connect(mongoose_connect_string, {useNewUrlParser:true}, function(error){
//     if(error){
//         console.log('MONGO CONNECTION ERROR',error);
//         throw new Error('MongoDB Connection Error'+error);
//     }
// });

var mongoose = require('mongoose');
// var mongoDB = 'mongodb+srv://dennis:zaq123@cluster0.wt6es.mongodb.net/test';//замените url!!!
var mongoDB = 'mongodb+srv://dennis:zaq123@cluster0.wt6es.mongodb.net/donations_db?retryWrites=true&w=majority';//замените url!!!
// mongoose.connect(mongoDB);
mongoose.connect(mongoDB, {useNewUrlParser:true}, function(error){
    if(error){
        console.log('MONGO CONNECTION ERROR',error);
        throw new Error('MongoDB Connection Error'+error);
    }
    else{

        console.log('Connected to Mongo', 'xxxx');
    }
});

// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// var Donation = require('models/donationModel');
// var books1 = require('models/book');
var Book = require('./models/book')
var Donation = require('./models/donation')


const express = require('express')
const app = express()


app.get('/', function (req, res) {
    res.send('hello world')
})

app.get('/new', function (req, res) {
//
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
          // handleError(err);
        // сохранили!
    });


//     var awesome_instance = new Book({
//         title: 'awesome',
//         summary: 'awesome',
//         isbn: 'awesome'
//     });
//
// // Сохранить новый экземпляр, передав callback
//     awesome_instance.save(function (err) {
//         if (err) return console.log('ssss')
//         // сохранили!
//     });



//
//     res.send(donation)

    let donation1 = {xxx: 'ssss'};

    res.status(200).json(donation1);
//
//     res.send('hello world177711555')
})

app.listen(3000)


//
// // Импортировать модуль mongoose
// var mongoose = require('mongoose');
//
// // Установим подключение по умолчанию
// var mongoDB = 'mongodb://127.0.0.1/my_database';
// mongoose.connect(mongoDB);
// // Позволим Mongoose использовать глобальную библиотеку промисов
// mongoose.Promise = global.Promise;
// // Получение подключения по умолчанию
// var db = mongoose.connection;
//
// // Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));