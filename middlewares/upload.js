var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
   
var upload = multer({ storage });

module.exports = function (app) {  
    app.post('/addproduct', (req, res, next) => {
        upload.array('fuMain')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            
            res.json({});   
        })
    })
}