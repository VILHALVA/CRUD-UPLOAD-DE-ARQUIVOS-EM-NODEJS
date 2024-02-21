
const express = require('express');
const router = express.Router();
const File = require('../models/File');
const fs = require('fs');
const path = require('path');

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).send("Arquivo não encontrado.");
        }

        const filePath = path.join(__dirname, '..', 'uploads', file.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await File.findByIdAndDelete(id);
        res.status(200).send("Arquivo deletado com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar o arquivo:", error);
        res.status(500).send("Erro ao deletar o arquivo.");
    }
});

module.exports = router;
