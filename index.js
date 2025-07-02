// const express = require("express");
// const methodOverride = require("method-override");
// const path = require("path");
// const bodyParser = require("body-parser");
// const moment = require("moment");

// require("dotenv").config();

// const session = require("express-session");
// const flash = require("connect-flash");

// const database = require("./config/database");
// const route = require("./routes/admin/indexroute");
// const routeadmin = require("./routes/client/indexroute");
// const systemConfig = require("./config/sytem");
// const cookieParser = require("cookie-parser");

// database.connect();


// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cookieParser()); 
// app.use(methodOverride("_method"));
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//   }),
// );
// app.use(flash());

// app.use(
//   "/tinymce",
//   express.static(path.join(__dirname, "node_modules", "tinymce")),
// );

// app.use((req, res, next) => {
//   res.locals.messages = req.flash();
//   next();
// });

// app.set("views", `${__dirname}/views`);
// app.set("view engine", "pug");

// app.locals.prefixAdmin = systemConfig.prefixAdmin;
// app.locals.moment = moment;


// app.use(express.static(`${__dirname}/public`));
// app.use("/admin", express.static(__dirname + "/public/admin"));

// // Routes PHẢI đặt TRƯỚC 404 handler
// route(app);
// routeadmin(app);

// // 404 handler - phải đặt SAU routes
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Error handling middleware - phải đặt CUỐI CÙNG
// app.use((err, req, res, next) => {
//   console.error("Error details:", err);
//   res.status(500).json({
//     error: "Internal Server Error",
//     message: err.message,
//   });
// });

// module.exports = app;

// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
//   });
// }





const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");

require("dotenv").config();

const session = require("express-session");
const flash = require("connect-flash");

const database = require("./config/database");
const route = require("./routes/admin/indexroute");
const routeadmin = require("./routes/client/indexroute");
const systemConfig = require("./config/sytem");
const cookieParser = require("cookie-parser");

// Khởi tạo database connection với retry logic
const initializeDatabase = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await database.connect();
      console.log("Database connected successfully");
      break;
    } catch (error) {
      console.error(`Database connection failed. Retries left: ${retries - 1}`);
      console.error("Error:", error.message);
      retries--;
      if (retries === 0) {
        console.error("Failed to connect to database after 5 attempts");
        process.exit(1);
      }
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Initialize database
initializeDatabase();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }),
);
app.use(flash());

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));
app.use("/admin", express.static(__dirname + "/public/admin"));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes PHẢI đặt TRƯỚC 404 handler
route(app);
routeadmin(app);

// 404 handler - phải đặt SAU routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware - phải đặt CUỐI CÙNG
app.use((err, req, res, next) => {
  console.error("Error details:", err);
  
  // Xử lý riêng cho MongoDB timeout errors
  if (err.message && err.message.includes('buffering timed out')) {
    console.error("Database timeout error detected");
    return res.status(503).json({
      error: "Service Temporarily Unavailable",
      message: "Database connection timeout. Please try again later.",
    });
  }
  
  // Xử lý riêng cho MongoDB connection errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    console.error("Database error detected");
    return res.status(503).json({
      error: "Database Error",
      message: "Database connection issue. Please try again later.",
    });
  }
  
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? "Something went wrong" : err.message,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app;

let server;
if (process.env.NODE_ENV !== "production") {
  server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  
  // Set server timeout
  server.timeout = 30000; // 30 seconds
}