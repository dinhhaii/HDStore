var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from detailcart');
    },

    add: (entity) => {
        return db.add('detailcart', entity);
    },
    
    single: (idcart) => {
        return db.load(`select * from detailcart where idcart = ${idcart}`);
    },

    update: (entity) => {
        return db.update('detailcart', 'id', entity);
    },

    delete: (id) => {
        return db.delete('detailcart', 'id', id);
    },
}