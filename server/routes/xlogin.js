const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');

const app = express();

app.post('login/', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, 'este-es-el-seed-desarrollo', { expiresIn: 60 * 60 * 24 * 30 }); //expira en 30 dias

        res.json({
            ok: true,
            usuario: usuarioBD,
            token: '123'
        });


    });
});

module.exports = app;