const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        };

        if ( !usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                  message: '(Usuario) o contrseña incorrectos'
                }
            });
        };

        //si la comparacion de passowrds no coincide
        if (!bcrypt.compareSync( body.password, usuarioDB.password )){
            res.json({
              ok:true,
              err: {
                  message: 'Usuario o (contraseña) incorrectos'
              }
            
            });
        };
        
        let token = jwt.sign({
          usuario: usuarioDB
        },process.env.SEED , {expiresIn:process.env.CADUCIDAD_TOKEN }); //esto expira en 30 dias: 60s * 60min*24h*30d


        console.log(object);
        res.json({
          ok:true,
          usuario: usuarioDB,
          token  //equivale a token:token
        });
        
    });

});

//Configuraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
 
  return {
       nombre: payload.name,
       email: payload.email,
       img: payload.picture,
       google:true
  }
}



//ruta que creamos para usar en el envio de token con Google SignIn
app.post('/google', async (req,res) =>{   //se define async para poder definir await en verify
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
             return res.status(403).json({
               ok:false,
               err: e
             });
        }); 
        
    Usuario.findOne({email:googleUser.email}, (err, usuarioDB) =>{
      if (err){
        return res.status(500).json({
            ok:false,
            err
        });
      };

       if (usuarioDB){
          if (usuarioDB.google === false){
            return res.status(400).json({
              ok:false,
              err:{
                message: 'Debe usar su autenticación normal'
              }
            });
          } else {
            let token = jwt.sign({
              usuario: usuarioDB
            }, process.env.SEED , {expiresIn:process.env.CADUCIDAD_TOKEN }); //esto expira en 30 dias: 60s * 60min*24h*30d 

            return res.json({
              ok:true,
              usuario:usuarioDB,
              token,
            })
          }
       } else {
           //Si el usuario no existe en nuestra base de datos
           let usuario = new Usuario();

           usuario.nombre = googleUser.nombre;
           usuario.email = googleUser.email;
           usuario.img = googleUser.img;
           usuario.google = true;
           usuario.password = ':)';


           usuario.save((err, usuarioDB) =>{
              if (err){
                return res.status(500).json({
                    ok:false,
                    err
                });
              };

              let token = jwt.sign({
                usuario: usuarioDB
              }, process.env.SEED , {expiresIn:process.env.CADUCIDAD_TOKEN }); //esto expira en 30 dias: 60s * 60min*24h*30d 
  
              return res.json({
                ok:true,
                usuario:usuarioDB,
                token,
              });


           });
       
       }
       
    });   

    // res.json({
    //   usuario: googleUser
    // });
});



module.exports = app;