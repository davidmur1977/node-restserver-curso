require('./config/config');

const express = require('express')
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));





mongoose.connect(process.env.URLDB,
    //linea que añadimos para evitar warning al lanzar el server.js
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base datos ONLINE');
    });

app.listen(3000, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});