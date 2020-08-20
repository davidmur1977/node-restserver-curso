


//=================================
//Puerto
//=================================
process.env.PORT = process.env.PORT || 3000;

//=================================
//Entorno
//=================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=================================
//Vencimiento del Token
//=================================
//60 segundos
//60 minutos
// 24 horas
//30 días
process.env.CADUCIDAD_TOKEN = 60*60*24*30;

//=================================
//SEED de autenticación
//=================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=================================
//Base de datps
//=================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    //urlDB = 'mongodb://cafe-user:12345@cluster0-hi6dz.mongodb.net:27017/cafe';
    urlDB = process.env.MONGO_URI;
    //urlDB = 'mongodb+srv://adminDavid:z2SNtcdfp2A90uGw@cluster0-hi6dz.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;

//=================================
//Google Client ID
//=================================
process.env.CLIENT_ID =  process.env.CLIENT_ID || '51433837470-teqptrlddpj08l8tgrgr9shnku08fj72.apps.googleusercontent.com';