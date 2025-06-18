const multer = require("multer")
module.exports =() => {
    const storage = multer.diskStorage({
        destination: function(req,file,cb) {
            cb(null, './public/uploads'); // Đường dẫn lưu file upload
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now();
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        }
    });

    return storage;
}