


//=================================
//Puerto
//=================================
process.env.PORT = process.env.PORT || 3000;

//=================================
//Entorno
//=================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=================================
//Base de datps
//=================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = 'mongodb://cafe-user:12345@cluster0-hi6dz.mongodb.net:27017/cafe';
}

process.env.urlDB = urlDB;
