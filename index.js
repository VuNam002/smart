const express = require('express'); 
const methodOverride = require("method-override"); 
const bodyParser = require('body-parser'); 
require("dotenv").config();  

const session = require('express-session'); 
const flash = require('connect-flash');  

const database = require("./config/database")  

const route = require("./routes/admin/indexroute"); 
const routeadmin = require("./routes/client/indexroute") 
const systemConfig = require("./config/sytem");  

database.connect();  

const app = express(); 
const port = process.env.PORT || 3000; // Thêm fallback port

app.use(methodOverride('_method')); 
//parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false}));  

// Thêm session và flash 
app.use(session({   
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Sử dụng env variable   
  resave: false,   
  saveUninitialized: true 
})); 
app.use(flash());  

// Đưa messages vào res.locals để view pug dùng được 
app.use((req, res, next) => {   
  res.locals.messages = req.flash();   
  next(); 
});  

app.set("views",`${__dirname}/views`); 
app.set("view engine", "pug");  

// App Locals Variables 
app.locals.prefixAdmin = systemConfig.prefixAdmin;   

app.use(express.static(`${__dirname}/public`)); //Phải có thế này mới pubic được 
app.use('/admin', express.static(__dirname + '/public/admin'));  

//Routes 
route(app); 
routeadmin(app);    

// Export app để Vercel có thể sử dụng
module.exports = app;

// Chỉ listen khi không phải môi trường production (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {   
    console.log(`Example app listening on port ${port}`) 
  })
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});