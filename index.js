const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const multer  = require('multer');
const path  = require('path');

dotenv.config();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '/images')))

mongoose.connect(process.env.MONGO_URL).then(console.log('conected to MONGODB')).catch(err => console.log(err))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    }, 
    filename: (req, file, cb) => {
        cb (null, /* 'hello.jpeg' */req.body.name);
    },
});
const upload = multer({storage: storage});
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json('File has been uploaded');
});


app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRoute);
//app.use('/api/posts', postRoute); мы регистрируем middleware-функцию postRoute для обработки всех запросов, которые начинаются с пути /api/posts. Таким образом, все запросы, которые соответствуют этому пути, будут переданы этой middleware-функции для обработки.которая будет вызываться для каждого входящего запроса. 



app.listen(5000, (err) => {
    err ? console.log(err) : console.log('hello from BACKEND');
});