var MySqli = require ( 'mysqli');

 let conn = new MySqli({
    host : 'localhost',
    post : 3306,
    user : 'makeup-shop',
    pass : '123456789makeup',
    db : 'makeup_shop'
});

let db= conn.emit(false,'');

module.exports = {
    database : db

};