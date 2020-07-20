const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
//aws-sdk
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path')
const app = express();


app.use(logger('dev'));
app.use(express.json());
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

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


const multipleImgUpload = multer({
    storage: multerS3({
        s3,
        bucket: 'files-distrodakwah',
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, path.basename(file.originalname))
        },
        contentType: multerS3.AUTO_CONTENT_TYPE
    }),
    limits: {
        fileSize: 2000000
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).array('galleryImage');

app.get('/', (req, res, next) => {
    console.log('asd')
    return 1;
})

app.post('/vendors', (req, res, next) => {
    multipleImgUpload(req, res, (error) => {
        if (error) {
            res.json({ error: error });
        } else {
            if (req.files === undefined) {
                res.json('Error: No file selected');
            } else {
                let fileArray = req.files,
                    fileLocation;
                const galleryImgLocationArray = [];
                for (let i = 0; i < fileArray.length; i++) {
                    fileLocation = fileArray[i].location;
                    
                    galleryImgLocationArray.push(fileLocation)
                }
                // Save the file name into database
                res.json({
                    filesArray: fileArray,
                    locationArray: galleryImgLocationArray
                });
            }
        }
    })
});
// app.use('/users', usersRouter);

module.exports = app;
