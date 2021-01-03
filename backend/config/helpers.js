var MySqli = require ( 'mysqli');

 let conn = new MySqli({
    host : 'localhost',
    post : 3306,
    user : 'makeup-shop',
    passwd : '123456789makeup',
    db : 'make_up'
});

let db= conn.emit(false,'');

module.exports = {
    database : db

};