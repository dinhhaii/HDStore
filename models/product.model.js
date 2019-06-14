var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from product');
    },

    allByCat: (id) => {
        return db.load(`select * from product where ${id} = idcategory`);
    },

    pageByCat: (catID, limit, offset) => {
        return db.load(`select * from product where idcategory = ${catID} limit ${limit} offset ${offset}`);
    },

    pageByTag: (proID, limit, offset) => {
        return db.load(`select * from product where id = ${proID} limit ${limit} offset ${offset}`);
    },

    countByCat: catID => {
        return db.load(`select count(*) as total from product where ${catID} = idcategory`)
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

    latestproduct: (limit) => {
        return db.load(`select * from product as p1 where createddate = (select max(createddate) from product as p2 where p1.id = p2.id) order by createddate desc limit ${limit} offset 0`);
    }
}