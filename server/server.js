require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //paraobtener toda la url de public creamos path, usa libreria nativa de node, no se usa paquete extra

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public 
app.use(express.static(path.resolve(__dirname, '../public'))); //en lugar de + se usa ,


//Configuración global de rutas
app.use(require('./routes/index'));

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