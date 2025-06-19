const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary config (nên dùng biến môi trường khi deploy thực tế)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'duzubskpy', 
    api_key: process.env.CLOUDINARY_API_KEY || '321178963641957', 
    api_secret: process.env.CLOUDINARY_API_SECRET || 'cDGu0DVl3sKOH2UF2m9h42wZLxk'
});

module.exports = async function uploadToCloudinary(req, res, next) {
    if (!req.file || !req.file.buffer) return next();

    try {
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload();
        req.file.cloudinaryUrl = result.secure_url;
        req.body[req.file.fieldname] = result.secure_url;
        next();
    } catch (err) {
        next(err);
    }
};