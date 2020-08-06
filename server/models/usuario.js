const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
   values:['ADMIN_ROLE', 'USER_ROLE'],
   message:'{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique:true,
         required: [true, 'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
       type: String,
       required: false
    },
    role:{
         type:String,
         default:'USER_ROLE',
         enum:rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    }, 

    google:{
        type: Boolean,
        default: false
    } 

});

//para no mostrar el password ni el campo donde se almancena vamos a "borrarla" del objeto (esquema)
//usamos el methods.toJSON, siempre se usa cuando se intenta imprimir mediante json

//aqui no usamos funcion de flecha porque necesitamos el this

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();  //tomamos el objeto de ese usuario.Asi tenemos todas las propiedades y metodos
    delete userObject.password;

    return userObject;

}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);
