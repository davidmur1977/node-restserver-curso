require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());
 
app.get('/usuario', function (req, res) {
  res.json('get Usuario');  //cambiamos .send por .json para trabajar con json
});

app.post('/usuario', function (req, res) {
  let body = req.body;

  if (body.nombre === undefined){
      res.status(400).json({
        ok:false,
        mensaje: 'El nombre es necesario'
      });
  } else{
    res.json({
      persona: body
    
    });  //lo mismo que body: body
  }

 
});

app.put('/usuario/:id', function (req, res) {
  
  let id = req.params.id; //el .id es el mismo nombre que :id de arriba,
  res.json({
    id   //es lo mismo que id: id, pero es redundante
  }); 
});

app.delete('/usuario', function (req, res) {
  res.json('delete Usuario');  //cambiamos .send por .json para trabajar con json
});
 
app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto: ', 3000);
});