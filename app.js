const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
//aws-sdk
const AWS = require('aws-sdk');



const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
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
    console.log('asd')
    return 1;
})

app.post('/vendors', (req, res, next) => {
    // console.log(req.body);
    // req.body.data.images.forEach(image => { console.log(image) })
    res.json(req.body.data.images)
    //   const params = {
    //       Bucket: "files-distrodakwah",
    //       Key: ``
    //   }
});
// app.use('/users', usersRouter);

module.exports = app;
