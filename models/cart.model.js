var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from cart');
    },

    add: (entity) => {
        return db.add('cart', entity);
    },
    
    single: (id) => {
        return db.load(`select * from cart where id = ${id}`);
    },

    update: (entity) => {
        return db.update('cart', 'id', entity);
    },

    delete: (id) => {
        return db.delete('cart', 'id', id);
    },

    descCart: () => {
        return db.load('SELECT * FROM cart ORDER BY id desc');
    }
}