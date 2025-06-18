// //code cấu hinh

// const mongoose  = require('mongoose');


// module.exports.connect = async()=> {
//     try {
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log("Connect Success!");
//     }catch(error){
//         console.log("Connect Error!");
//     }
// }

const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success!");
    } catch (error) {
        console.log("Connect Error:", error); // Log chi tiết lỗi
        throw error; // Throw lỗi để app biết connection failed
    }
}
