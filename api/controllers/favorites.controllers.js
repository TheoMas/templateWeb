const db = require("../models");
const UserFavorites = db.user_favorites;
const Pollution = db.pollution;

// Ajouter une pollution aux favoris
exports.addFavorite = (req, res) => {
  const userId = req.body.userId;
  const pollutionId = req.body.pollutionId;

  if (!userId || !pollutionId) {
    res.status(400).send({
      message: "userId et pollutionId sont requis!"
    });
    return;
  }

  UserFavorites.create({
    userId: userId,
    pollutionId: pollutionId
  })
    .then(data => {
      res.send({ message: "Favori ajouté avec succès", data });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de l'ajout du favori."
      });
    });
};

// Retirer une pollution des favoris
exports.removeFavorite = (req, res) => {
  const userId = req.params.userId;
  const pollutionId = req.params.pollutionId;

  UserFavorites.destroy({
    where: {
      userId: userId,
      pollutionId: pollutionId
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Favori supprimé avec succès."
        });
      } else {
        res.send({
          message: `Impossible de supprimer le favori.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la suppression du favori."
      });
    });
};

// Récupérer tous les favoris d'un utilisateur
exports.getUserFavorites = (req, res) => {
  const userId = req.params.userId;

  UserFavorites.findAll({
    where: { userId: userId },
    include: [{
      model: Pollution,
      as: 'pollution'
    }]
  })
    .then(data => {
      const pollutions = data.map(fav => fav.pollution);
      res.send(pollutions);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération des favoris."
      });
    });
};

// Vérifier si une pollution est dans les favoris
exports.isFavorite = (req, res) => {
  const userId = req.params.userId;
  const pollutionId = req.params.pollutionId;

  UserFavorites.findOne({
    where: {
      userId: userId,
      pollutionId: pollutionId
    }
  })
    .then(data => {
      res.send({ isFavorite: !!data });
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la vérification du favori."
      });
    });
};
