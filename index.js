const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();

const session = require("express-session");
const flash = require("connect-flash");

const database = require("./config/database");
const route = require("./routes/admin/indexroute");
const routeadmin = require("./routes/client/indexroute");
const systemConfig = require("./config/sytem");
const cookieParser = require("cookie-parser");

database.connect();


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

app.use(express.static(`${__dirname}/public`));
app.use("/admin", express.static(__dirname + "/public/admin"));

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
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}