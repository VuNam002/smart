module.exports.createPost = (req, res, next) => {
    if (!req.body || !req.body.title || req.body.title.trim().length < 8) {
        req.flash(
            "error",
            "Tiêu đề không được để trống và phải có ít nhất 8 ký tự!"
        );
        const backURL = req.header("Referer") || "/admin/products";
        return res.redirect(backURL);
    }
    next();
};