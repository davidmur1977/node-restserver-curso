


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
    //urlDB = 'mongodb://cafe-user:12345@cluster0-hi6dz.mongodb.net:27017/cafe';
    urlDB = 'mongodb+srv://cafe-user:12345@cluster0-hi6dz.mongodb.net/cafe?retryWrites=true&w=majority';
    //urlDB = 'mongodb+srv://adminDavid:z2SNtcdfp2A90uGw@cluster0-hi6dz.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;
