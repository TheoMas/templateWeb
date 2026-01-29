module.exports = app => {
  const favorites = require("../controllers/favorites.controllers.js");
  const authenticateJWT = require("../jwt-middleware.js");
  var router = require("express").Router();

  // Toutes les routes favorites protégées par JWT
  router.use(authenticateJWT);
  router.post("/", favorites.addFavorite);
  router.delete("/:userId/:pollutionId", favorites.removeFavorite);
  router.get("/:userId", favorites.getUserFavorites);
  router.get("/:userId/:pollutionId", favorites.isFavorite);

  app.use('/api/favorites', router);
};
