// var express = require('express'),
//     app = express(),
//     http = require('http'),
//     server = http.createServer(app),
//     xmlparser = require('express-xml-bodyparser');

// // .. other middleware ...  
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(xmlparser());
// // ... other middleware ...  

// app.post('/receive-xml', function (req, res, next) {

//     // req.body contains the parsed xml 

// });

// server.listen(1337);
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/tallyUpdateModel'), //created model loading here
    bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var MongoClient = require('mongodb').MongoClient

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
// global["db"] = mongoose.connect('mongodb://localhost/absolute');
MongoClient.connect('mongodb://localhost:27017/absolute', function (err, db) {
    if (err) throw err;

    global["db"] = db;
    // var data = db.collection('invoices').find({});
    // db.collection('invoices').find({}).toArray(function (err, result) {
    //     if (err) {
    //         res.send(err);
    //     }
    //     else {
    //         console.log("result", result);
    //         // res.send(JSON.stringify(result));
    //     }
    // })

});


// console.log(db.invoices.find().pretty())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlparser());
app.use(bodyParser.json());

var routes = require('./api/routes/tallyUpdateRoutes'); //importing route

// app.post('/updateTally', function (req, res, next) {
//     console.log("in server js2", req.body.result.importbill)
//     res.json(req.body.result);
//     // req.body contains the parsed xml 

// });
routes(app); //register the route


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);


//  Retrieve
// var MongoClient = require('mongodb').MongoClient;

// // Connect to the db
// MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
//   if(err) { return console.dir(err); }

//   var collection = db.collection('test');
//   var doc1 = {'hello':'doc1'};
//   var doc2 = {'hello':'doc2'};
//   var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

//   collection.insert(doc1);

//   collection.insert(doc2, {w:1}, function(err, result) {});

//   collection.insert(lotsOfDocs, {w:1}, function(err, result) {});

// });