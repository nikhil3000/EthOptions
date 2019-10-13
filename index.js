const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
var mongoose = require('mongoose');
var config = require('./config');
const path = require('path');


//Mongoose connection
mongoose.connect(config.db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log("DB connected", config.db.mongoURI))
    .catch(err => console.log("db err", err));


app.use(express.static(path.join(__dirname, "client/public")))


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token,X-PINGOTHER");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./Models/Gig')
const Gig = mongoose.model('Gig');


app.post('/postData', (req, res) => {

})

app.listen(port, () => {
    console.log(`server started at port ${port}`);
})



app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

var port = process.env.PORT || 5000;