module.exports = app => {
  const catalogue = require("../controllers/catalogue.controllers.js");
  const authenticateJWT = require("../jwt-middleware");
  let router = require("express").Router();

  // Toutes les routes catalogue protégées par JWT
  router.use(authenticateJWT);
  router.get("/", catalogue.get);

  app.use('/api/catalogue', router);
};
