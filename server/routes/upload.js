const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');


const Usuario = require('../models/usuario');   //necesario para grabar imagen de usuario
const Producto = require('../models/producto');   //necesario para grabar imagen de usuario

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    
     let tipo = req.params.tipo;
     let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).
        json({
            ok:false,
            err: {
                message :'No se ha seleccionado ningún archivo'
            }
        });
    }
    
    //Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
              
            }
        });
    }

    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

     //Extensiones permitidas
     let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

     if (extensionesValidas.indexOf(extension) < 0){
         return res.status(400).json({
             ok:false,
             err: {
                 message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                 ext: extension
             }
         });
     }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
          return res.status(500).jsons({
              ok: false,
              err
          });
    
         if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
         } else {
            imagenProducto(id, res, nombreArchivo);
         }
        //Aqui, imagen cargada
        //quitamos el res.json y llamamos a imagenUsuario() 
        //imagenUsuario(id, res, nombreArchivo);   <---- ultimo que pusimos
        // res.json({
        //     ok:true,
        //     message: 'Imagen subida correctamente'
        // });
      });

});

//pasamos el res como parametro pq dentro de la funcion no existe, 
//este res es el de despues de archivo.mv()
//se pasa nombreArchivo pq es lo unico que quiero grabar, no todo el path
function imagenUsuario(id, res, nombreArchivo) {    
   Usuario.findById(id, (err, usuarioDB) =>{
         
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        
        if (!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err:{
                    message: 'Usuario no existe'
                }
            });
        }

        //Antes de grabar, hay que confirmar que imagen existe
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) =>{
            res.json({
                usuario:usuarioGuardado,
                img:nombreArchivo
            });
        });

   });

}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) =>{
         
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        
        if (!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err:{
                    message: 'Producto no existe'
                }
            });
        }

        //Antes de grabar, hay que confirmar que imagen existe
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) =>{
            res.json({
                producto:productoGuardado,
                img:nombreArchivo
            });
        });

   });
}

function borraArchivo(nombreImagen, tipo){
    //Antes de grabar, hay que confirmar que imagen existe
        //los 2 .. primeros es para llegar a carpeta server, los siguientes .. es para lelgar a carpeta uploads
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

        if (fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}


module.exports = app;