const express = require('express');
const server = express();
const {PORT} = require('../config');
const uniara = require('./services/uniara');

server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.get('/', async (req,res) => {
    // Obtendo dados do client
        const { cod, password } = req.body;

    // Iniciando sessao, adq foto e arquivos
        let findUser = await uniara.open(cod, password);
        if(findUser.status == 1) {
            const { html } = findUser;
            // Obtendo dados pessoais
                let name = await uniara.getName(html);
                let photo_url = await uniara.getPhoto(html);
                // Verificando RA e formatando (-)
                if(cod[5] != "-") {
                    ra = cod.slice(0, 5);
                    ra = ra + "-" + cod.slice(5);
                }

            res.json({
                ra,
                name,
                photo_url,
            })
        } else if(findUser.status == 0) {
            const { error } = findUser;
            res.json({
                error: "Houve um error, analise as credencias e tente novamente!",
            })
        }
})

server.listen(PORT, () => {
    console.log('Listening server in port: '+PORT);
})