
const express = require('express');

const { verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//=======================
//Obtener productos
//=======================
app.get('/productos', (req, res) =>{
    //trae todos los productos
    //populate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0; //si viene el parametro salta desde ese valor, sino, ninguno
    desde = Number(desde);

    Producto.find({disponible:true})   //todos los disponibles
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email') 
             .populate('categoria', 'descripcion')
            .exec( (err, productos) =>{
                if (err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    productos
                });
               
            });

});

//=======================
//Obtener producto por ID
//=======================
app.get('/productos/:id', (req, res) =>{
    //trae todos los productos
    //populate: usuario y categoria

    let id = req.params.id;
    Producto.findById(id)
             .populate('usuario', 'nombre email')
             .populate('categoria', 'descripcion')
             .exec( (err, productoDB) =>{
        
                    if (err){
                        return res.status(500).json({
                            ok:false,
                            err
                        });
                    }
            
                    if (!productoDB){
                        return res.json(500).json({
                          ok:false,
                          err:{
                             message: 'El ID no es correcto' 
                          }
                        });
                    }
            
                    res.json({
                        ok:true,
                        producto: productoDB
                    });
                });

});

//=======================
//Buscar producto
//=======================
app.get('/productos/buscar/:termino', verificaToken, (req, res) =>{
    
    let termino = req.params.termino;
    
    let regex = new RegExp(termino, 'i'); //i : insensible a masc y min
    
    Producto.find({ nombre:regex })
         .populate('categoria', 'nombre')
         .exec((err, productos) =>{
            
            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                productos
            })
         });
});



//=======================
//Crear nuevo producto
//=======================
app.post('/productos', verificaToken, (req, res) =>{
   
    let body = req.body;

    
    let producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

   
    producto.save( (err, productoDB)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        
       
        res.status(201).json({
            ok:true,
            producto:productoDB
        });
    }); 
  
});

//=======================
//Actualizar un nuevo producto
//=======================
app.put('/productos/:id', (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    //vamos a verificar que existe el producto
    Producto.findById(id, (err, productoDB) =>{
        if (err) {
           return res.status(500).json({
              ok:false,
              err
           });
        }

        if (!productoDB){
            return res.status(400).json({
                 ok:false,
                 err:{
                     message:'El ID no existe'
                 }
            });
        }
        
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        
        productoDB.save(  (err, productoGuardado) =>{
            if (err) {
                return res.status(500).json({
                   ok:false,
                   err
                });
            }

            res.json({
                ok:true,
                producto:productoGuardado
            })
        });

    });

});

//=======================
//Borrar un  producto
//=======================
app.delete('/productos/:id', (req, res) =>{
    
    let id = req.params.id;

    Producto.findById( id, (err, productoDB) =>{
        
        if (err) {
            return res.status(500).json({
               ok:false,
               err
            });
        }

        if (!productoDB){
            return res.status(400).json({
                 ok:false,
                 err:{
                     message:'El ID no existe'
                 }
            });
        }

        productoDB.disponible = false;

        productoDB.save( (err, productoBorrado) =>{
            
            if (err) {
                return res.status(500).json({
                   ok:false,
                   err
                });
            }

            res.json({
                ok:true,
                prodcuto:productoBorrado,
                mensaje: 'Producto borrado'
            });

        });



    });
});








module.exports = app;

