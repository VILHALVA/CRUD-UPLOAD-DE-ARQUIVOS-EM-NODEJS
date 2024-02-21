const express = require('express');
const multer  = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs'); 
const bodyParser = require('body-parser');
const File = require('./models/File');
const deleteRoute = require('./routes/delete');
const editRoute = require('./routes/edit');

const app = express();

// CONEXÃO COM DATABASE:
mongoose.connect('mongodb://127.0.0.1:27017/file-upload', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('CONECTADO AO MONGODB!'))
    .catch(err => console.log(err));

// ROTAS:
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
    const files = await File.find();
    res.render('index', { files, path: path });
});

app.get('/view/:id', async (req, res) => {
    const id = req.params.id;
    const file = await File.findById(id);
    if (file) {
        res.render('view', { fileName: file.name });
    } else {
        res.status(404).send('File not found');
    }
});

app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).send('File not found');
        }
        const filePath = path.join(__dirname, 'public/uploads', file.name);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await File.findByIdAndDelete(id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.use('/delete', deleteRoute);
app.use('/edit', editRoute);

app.post('/upload', upload.single('fileToUpload'), async (req, res) => {
    const file = new File({
        name: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
    });
    await file.save();
    res.redirect('/');
});

// START:
app.listen(3000, () => console.log('SERVIDOR RODANDO NA PORTA 3000'));
