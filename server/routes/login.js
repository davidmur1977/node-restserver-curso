const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const _= require('underscore');

const Usuario = require('../models/usuario');
const app = express();



app.post('/login', (req,res) =>{

    let body = req.body;

    //solo interesa regresar uno
    Usuario.findOne({email:body.email }, (err, usuarioDB)=>{
        
        if (err){
          return res.status(500).json({
              ok:false,
              err
          });
        }

        if ( !usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                  message: '(Usuario) o contrseña incorrectos'
                }
            });
        }

        //si la comparacion de passowrds no coincide
        if (!bcrypt.compareSync( body.password, usuarioDB.password )){
            res.json({
              ok:true,
              err: {
                  message: 'Usuario o (contraseña) incorrectos'
              }
            
            }) ;
        }
        
        let token = jwt.sign({
          usuario: usuarioDB
        },process.env.SEED , {expiresIn:process.env.CADUCIDAD_TOKEN }); //esto expira en 30 dias: 60s * 60min*24h*30d

        JSON.stringify(res.json({
          ok:true,
          usuario: usuarioDB,
          token  //equivale a token:token
        }));

    });

});





module.exports = app;