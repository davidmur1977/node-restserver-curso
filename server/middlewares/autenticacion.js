const jwt = require('jsonwebtoken');


//=======================
//Verificar Token
//=======================

let verificaToken = (req, res, next ) => {

     let token = req.get('token');

     jwt.verify(token, process.env.SEED, (err, decoded) =>{

          if (err){
              return res.status(401).json({
                  ok:false,
                  err: {
                      message: 'Token no válido'
                  }
              });
          }

          req.usuario = decoded.usuario;
          next();
     });

     console.log(token);
    // next();   //esto se pone para que haga lo sieguiente de la logica de la llamada a get Usuarios, sin el next() no ejecutaria nada mas
               //ponemos console log para demostrar que se efectura la captura del token



};

//=======================
//Verificar AdminRole
//=======================
let verificaAdmin_Role = (req, res, next) =>{

    let usuario = req.usuario;
    
    if (usuario.role === 'ADMIN_ROLE'){
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    
};

//=======================
//Verifica token para iamgen
//=======================
let verificaTokenImg = (req, res, next) =>{

    let token = req.query.token;//lo que ponga en url
    jwt.verify(token, process.env.SEED, (err, decoded) =>{

        if (err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
   });
};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}