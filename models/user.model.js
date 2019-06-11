var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from user');
    },

    allWithDetail: () => {
        return db.load('select c.id, c.name, c.createddate, count(p.id) as totalproduct from user c left join product p on c.id = p.iduser group by c.id, c.name, c.createddate');
    },

    add: (entity) => {
        return db.add('user', entity);
    },
    
    single: (id) => {
        return db.load(`select * from user where id = ${id}`);
    },

    update: (entity) => {
        return db.update('user', 'id', entity);
    },

    delete: (id) => {
        return db.delete('user', 'id', id);
    }
}