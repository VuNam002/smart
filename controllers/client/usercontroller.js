const User = require("../../models/user.model")
const md5 = require("md5");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail")

//[GET]/user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký"
    });
}
//[POST]/user/register
module.exports.registerPost = async (req, res) => {
    const exisEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if(exisEmail) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("/user/register");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/");
}

//[GET]/user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    });
}
//[POST]/user/login
module.exports.loginPost = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("/user/login");
        return
    }
    if(user.password !== md5(password)) {
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect("/user/login");
        return
    }
    if(user.status === "inactive") {
        req.flash("error", "Tài khoản chưa được kích hoạt!");
        res.redirect("/user/login");
        return
    }
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/");
}
//[GET]/user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

//[GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
}

//[POST]/user/pasword/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if(!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("/user/password/forgot");
        return
    }

    //Viec1
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    //Viec2: mã otp
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html=`
        Mã OTP xác minh lấy lại mật khẩu là: <b>${otp}</b>
    `

    sendMailHelper.senMail(email,subject,html)
    

    res.redirect(`/user/password/otp?email=${email}`);

}
//[GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    const otp = req.query.otp;

    res.render("client/pages/user/otp-password", {
        pageTitle:"Nhập mã OTP",
        email: email,
    });
}
//[POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,
        deleted: false
    });
    if(!result) {
        req.flash("error", "Mã OTP không đúng!");
        res.redirect(`/user/password/otp?email=${email}`);
        return
    }

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    

    res.cookie("tokenUser", tokenUser)

    res.redirect("/user/password/reset");

}
//[GET] /user/password/reset
module.exports.resetPassWord = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    });
}

//[POST] /user/password/reset
module.exports.resetPassWordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.findOne({
        tokenUser: tokenUser,
        deleted: false
    },{
        password: md5(password)
    });
    res.redirect("/user/login");
}
