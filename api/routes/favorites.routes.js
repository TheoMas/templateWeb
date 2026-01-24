module.exports = app => {
  const favorites = require("../controllers/favorites.controllers.js");

  var router = require("express").Router();

  // Ajouter un favori
  router.post("/", favorites.addFavorite);

  // Retirer un favori
  router.delete("/:userId/:pollutionId", favorites.removeFavorite);

  // Récupérer tous les favoris d'un utilisateur
  router.get("/:userId", favorites.getUserFavorites);

  // Vérifier si une pollution est favorite
  router.get("/:userId/:pollutionId", favorites.isFavorite);

  app.use('/api/favorites', router);
};
