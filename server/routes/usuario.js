const express = require('express');

const bcrypt = require('bcrypt');
const _= require('underscore');

const Usuario = require('../models/usuario');

const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');
const app = express();


app.get('/usuario', [verificaToken, verificaAdmin_Role],  (req, res)=> {
    
  return res.json({
       usuario: req.usuario,
       nombre: req.usuario.nombre,
       email:req.usuario.email,    
       
  })
    

   let desde = req.query.desde || 0; //si viene el parametro salta desde ese valor, sino, ninguno
   desde = Number(desde);

   let limite = req.query.limi || 5; //si no especifica el limite, muestra 5
   limite= Number(limite);

   //estado:true devolvera los de estado = true
    Usuario.find({estado:true}, 'nombre email role estado google img') //en el string podemos poner qué campos vamos a mostrar
           .skip(desde) //salta los primeros 5 regirsotrs se usa para crear el "paginado"
           .limit(limite)  //devuelve 5 usuarios
           .exec( (err, usuarios) =>{
            if (err){
              return res.status(400).json({
                  ok:false,
                  err
              });
             }
            // estado:true contara los de estado = true
             Usuario.count({estado:true}, (err, conteo)=>{
                res.json({
                  ok:true,
                  usuarios,
                  cuantos:conteo
              });
             });
            

           })

  });
  
  app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
      let body = req.body;
    
    let usuario = new Usuario({
        nombre:body.nombre,
        email: body.email,
        password:bcrypt.hashSync(body.password, 10),
        role:body.role
    });

    usuario.save( (err, usuarioDB)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

       
        res.json({
            ok:true,
            usaurio:usuarioDB
        });

    });
 
  });
  
  app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    
    let id = req.params.id; //el .id es el mismo nombre que :id de arriba,

    //devolvemos el objeto de req.body pero con los campos que quiero que sí se puedan actualizar
    body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
   


    //new devuelve nuevo documento en lugar del original, runValidators corremos las validaciones definidas en el esquems
    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, usuarioDB)=>{
      
      if (err){
        return res.status(400).json({
            ok:false,
            err
        });
      }
      
        res.json({
         ok:true,
         usuario:usuarioDB
        }); 


    })

    
  });
  
  app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role],  function (req, res) {
    
       let id = req.params.id;

       //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

       //En lugar de borrar fisicamente pondremos estado = false
       let cambiaEstado = {
         estado:false,
       };

       //En lugar de borrar fisicamente pondremos estado = false
       Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true},  (err,  usuarioBorrado)=>{
          
          if (err){
              return res.status(400).json({
                  ok:false,
                  err
              });
          };

          if (usuarioBorrado === null){
              return res.status(400).json({
                ok:false,
                err:{
                  message: 'Usuario no encontrado'
                }
            });
          }


          res.json({
            ok:true,
            usuario:usuarioBorrado
          })

       })


  });



  module.exports = app;