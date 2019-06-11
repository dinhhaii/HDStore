var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from product_tag');
    },

    add: (entity) => {
        return db.add('product_tag', entity);
    },
    
    single: (id) => {
        return db.load(`select * from product_tag where id = ${id}`);
    },

    update: (entity) => {
        return db.update('product_tag', 'id', entity);
    },

    delete: (id) => {
        return db.delete('product_tag', 'id', id);
    }
}