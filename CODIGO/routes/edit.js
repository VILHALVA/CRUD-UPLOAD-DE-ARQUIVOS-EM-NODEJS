const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).send('Arquivo não encontrado.');
        }
        res.render('edit', { file, path });
    } catch (error) {
        console.error("Erro ao buscar o arquivo:", error);
        res.status(500).send('Erro interno do servidor.');
    }
});

router.post('/', async (req, res) => {
    const { id, file_name } = req.body;
    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).send('Arquivo não encontrado.');
        }
        
        const oldFilePath = path.join(__dirname, '..', 'public/uploads', file.name);
        const fileExtension = path.extname(file.name);
        const newFilePath = path.join(__dirname, '..', 'public/uploads', file_name + fileExtension);
        
        if (fs.existsSync(oldFilePath)) {
            fs.renameSync(oldFilePath, newFilePath);
        } else {
            return res.status(404).send('Arquivo não encontrado.');
        }
        
        file.name = file_name + fileExtension;
        file.modified_at = Date.now(); 
        await file.save();
        
        res.redirect('/');
    } catch (error) {
        console.error("Erro ao editar o arquivo:", error);
        res.status(500).send('Erro interno do servidor.');
    }
});

module.exports = router;
