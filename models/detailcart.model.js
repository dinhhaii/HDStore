var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from detailcart');
    },

    add: (entity) => {
        return db.add('detailcart', entity);
    },
    
    findIDCart: (idcart) => {
        return db.load(`select * from detailcart where idcart = ${idcart}`);
    },

    findIDProduct: (idproduct) => {
        return db.load(`select * from detailcart where idproduct = ${idproduct}`);
    },

    update: (entity) => {
        return db.update('detailcart', 'id', entity);
    },

    delete: (id) => {
        return db.delete('detailcart', 'id', id);
    },
}