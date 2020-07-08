const express = require('express');
const router = express.Router();
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
//aws-sdk
const AWS = require('aws-sdk');



const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY_ID,
    secretAccessKey: process.env.DO_SPACE_SECRET_ACCESS_KEY
})

app.get('/', (req, res, next) => {
    s3.listBuckets({}, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
            data['Buckets'].forEach(function (space) {
                console.log(space['Name']);
            })
        };
    })
});
// app.use('/users', usersRouter);

module.exports = app;
