const mysql = require('mysql2');
const db = mysql.createConnection({
    host: '127.0.0.1',
    user:'root',
    password:'Schasamidamysql9@0_',
    database: 'proyecto_emapp'
});

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('Base de datos para proyecto de titulo!!!');
});
module.exports = db;

