const express = require('express');
let { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();


let Categoria = require('../models/categoria');

//============================
//Mostrar todas las categorias
//============================
app.get('/categoria', (req,res) =>{
    Categoria.find({})

    //al listas las categorias las ordena por descripcion
    .sort('descripcion')
    //cuando encuentre los id's mostrará lo que indique dentro de ()'s, es decir: muestra datos de cada usaurio de cada id categoria mostrado
    //al añadir nombre email, solo mostrara nombre y email del usuario (y el id)

    .populate('usuario', 'nombre email') 
    .exec( (err, categorias) =>{
     if (err){
         return res.status(500).json({
             ok:false,
             err
         });
     }

     res.json({
         ok:true,
         categorias
     });

    })
});

//============================
//Mostrar una categoria por ID
//============================
app.get('/categoria/:id', (req,res) =>{
  

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) =>{
        
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoriaDB){
            return res.json(500).json({
              ok:false,
              err:{
                 message: 'El ID no es correcto' 
              }
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });
});

//=====================
//Crear nueva categoria
//=====================
app.post('/categoria', verificaToken, (req,res) =>{
    
    let body = req.body;
    let categoria = new Categoria({
       descripcion: body.descripcion,
       usuario:req.usuario._id
       
    });
    
    categoria.save( (err, categoriaDB)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoriaDB){
            return res.json(400).json({
              ok:false,
              err
            });
        }
       
        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
    
});

//=====================
//Actualizar categoria
//=====================
app.put('/categoria/:id', (req,res) =>{
    
    let id = req.params.id;
    let body = req.body;
   
    let descCategoria = {
        descripcion : body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, {new:true, runValidators:true}, (err, categoriaDB) =>{
       
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoriaDB){
            return res.json(400).json({
              ok:false,
              err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        });

    });

});

//=====================
//Borrar categoria
//=====================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req,res) =>{
    //regresa la nueva categoria
    //solo un administrador puede borrar una categoria
    //ha de pedir token
    //Categoria.findByIdAndRemove


    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) =>{

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoriaDB){
            return res.json(400).json({
              ok:false,
              err:{
                  message: 'El id no existe'
              }
            });
        }

        res.json({
            ok:true,
            message:'Categoria Borrada'
        });
    });


});






module.exports = app;