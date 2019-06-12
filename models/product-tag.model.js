var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from product_tag');
    },

    allTagByproduct: (idproduct) => {
        return db.load(`select * from product_tag pt, tag t where ${idproduct} = idproduct and t.id = pt.idtag`);
    },

    allproductByTag: (id) => {
        return db.load(`select * from product_tag where ${id} = idtag`);
    },

    pageproductByTag: (tagID, limit, offset) => {
        return db.load(`select * from product_tag as pt, product as p where pt.idtag = ${tagID} and pt.idproduct = p.id limit ${limit} offset ${offset}`);
    },

    countproductByTag: tagID => {
        return db.load(`select count(*) as total from product_tag where ${tagID} = idtag`)
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