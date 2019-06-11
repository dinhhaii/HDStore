var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from product');
    },

    add: (entity) => {
        return db.add('product', entity);
    },
    
    single: (id) => {
        return db.load(`select * from product where id = ${id}`);
    },

    update: (entity) => {
        return db.update('product', 'id', entity);
    },

    delete: (id) => {
        return db.delete('product', 'id', id);
    },

    getIDName: (name) => {
        return db.load(`select id from product where name = ${name}`);
    },

    getName: (id) => {
        return db.load(`select name from product where id =${id}`)
    }
}