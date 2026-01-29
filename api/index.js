

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const db = require("./models");

const app  = express ();

// Gestion dynamique de l'origine CORS
const DEV_ORIGIN = process.env.DEV_ORIGIN || 'http://localhost:4200';
const PROD_ORIGIN = process.env.PROD_ORIGIN || 'https://ton-front-en-prod.com';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGIN = NODE_ENV === 'production' ? PROD_ORIGIN : DEV_ORIGIN;

const corsOptions = {
  origin: ALLOWED_ORIGIN,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};


app.use(cors(corsOptions));

// Parse cookies (so we can read httpOnly cookies via req.cookies)
app.use(cookieParser());

// parse requests of content-type - application/json
// Augmenter la limite à 10MB pour supporter les images base64
app.use(express.json({ limit: '10mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CNAM application." });
});

db.sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

require("./routes")(app);

// set port, listen for requests (use dynamic port provided by Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

