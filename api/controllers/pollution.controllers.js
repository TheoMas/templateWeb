const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

// Patterns de validation
const patterns = {
  titre: /^[a-zA-ZÀ-ÿ0-9\s\-']{1,255}$/,
  lieu: /^[a-zA-ZÀ-ÿ0-9\s,.\-']{1,255}$/,
  type_pollution: /^[a-zA-ZÀ-ÿ\s\-]{1,100}$/,
  latitude: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,6})?$/,
  longitude: /^-?(1[0-7][0-9]|[0-9]?[0-9])(\.[0-9]{1,6})?$/,
  photo_url: /^https?:\/\/.{1,500}$/,
  description: /^[\s\S]{0,2000}$/
};

// Fonction de validation
const validateInput = (field, value, pattern) => {
  if (!value) return true; // Les champs optionnels peuvent être vides
  return pattern.test(value);
};

// Créer et sauvegarder une nouvelle pollution
exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.titre) {
    res.status(400).send({
      message: "Le titre ne peut pas être vide!"
    });
    return;
  }

  // Validation avec regex
  if (!validateInput('titre', req.body.titre, patterns.titre)) {
    res.status(400).send({
      message: "Le titre contient des caractères invalides ou est trop long (max 255 caractères)."
    });
    return;
  }

  if (req.body.lieu && !validateInput('lieu', req.body.lieu, patterns.lieu)) {
    res.status(400).send({
      message: "Le lieu contient des caractères invalides ou est trop long (max 255 caractères)."
    });
    return;
  }

  if (req.body.type_pollution && !validateInput('type_pollution', req.body.type_pollution, patterns.type_pollution)) {
    res.status(400).send({
      message: "Le type de pollution contient des caractères invalides (max 100 caractères)."
    });
    return;
  }

  if (req.body.latitude && !validateInput('latitude', req.body.latitude.toString(), patterns.latitude)) {
    res.status(400).send({
      message: "La latitude doit être comprise entre -90 et 90 degrés."
    });
    return;
  }

  if (req.body.longitude && !validateInput('longitude', req.body.longitude.toString(), patterns.longitude)) {
    res.status(400).send({
      message: "La longitude doit être comprise entre -180 et 180 degrés."
    });
    return;
  }

  if (req.body.photo_url && !validateInput('photo_url', req.body.photo_url, patterns.photo_url)) {
    res.status(400).send({
      message: "L'URL de l'image doit être une URL HTTP ou HTTPS valide (max 500 caractères)."
    });
    return;
  }

  if (req.body.description && !validateInput('description', req.body.description, patterns.description)) {
    res.status(400).send({
      message: "La description est trop longue (max 2000 caractères)."
    });
    return;
  }

  // Créer une pollution
  const pollution = {
    titre: req.body.titre,
    lieu: req.body.lieu,
    date_observation: req.body.date_observation,
    type_pollution: req.body.type_pollution,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photo_url
  };

  // Sauvegarder la pollution dans la base de données
  Pollution.create(pollution)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la création de la pollution."
      });
    });
};

// Récupérer toutes les pollutions
exports.findAll = (req, res) => {
  const titre = req.query.titre;
  
  // Validation de la recherche pour éviter les injections
  if (titre && !validateInput('titre', titre, patterns.titre)) {
    res.status(400).send({
      message: "Le paramètre de recherche contient des caractères invalides."
    });
    return;
  }
  
  let condition = titre ? { titre: { [Op.iLike]: `%${titre}%` } } : null;

  Pollution.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la récupération des pollutions."
      });
    });
};

// Récupérer une pollution par id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // Validation de l'ID (doit être un nombre entier)
  if (!/^[0-9]+$/.test(id)) {
    res.status(400).send({
      message: "L'ID doit être un nombre entier positif."
    });
    return;
  }

  Pollution.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Pollution avec id=${id} introuvable.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de la pollution avec id=" + id
      });
    });
};

// Mettre à jour une pollution par id
exports.update = (req, res) => {
  const id = req.params.id;

  // Validation de l'ID
  if (!/^[0-9]+$/.test(id)) {
    res.status(400).send({
      message: "L'ID doit être un nombre entier positif."
    });
    return;
  }

  // Validation des champs à mettre à jour
  if (req.body.titre && !validateInput('titre', req.body.titre, patterns.titre)) {
    res.status(400).send({
      message: "Le titre contient des caractères invalides."
    });
    return;
  }

  if (req.body.lieu && !validateInput('lieu', req.body.lieu, patterns.lieu)) {
    res.status(400).send({
      message: "Le lieu contient des caractères invalides."
    });
    return;
  }

  if (req.body.type_pollution && !validateInput('type_pollution', req.body.type_pollution, patterns.type_pollution)) {
    res.status(400).send({
      message: "Le type de pollution contient des caractères invalides."
    });
    return;
  }

  if (req.body.latitude && !validateInput('latitude', req.body.latitude.toString(), patterns.latitude)) {
    res.status(400).send({
      message: "La latitude doit être comprise entre -90 et 90 degrés."
    });
    return;
  }

  if (req.body.longitude && !validateInput('longitude', req.body.longitude.toString(), patterns.longitude)) {
    res.status(400).send({
      message: "La longitude doit être comprise entre -180 et 180 degrés."
    });
    return;
  }

  if (req.body.photo_url && !validateInput('photo_url', req.body.photo_url, patterns.photo_url)) {
    res.status(400).send({
      message: "L'URL de l'image doit être une URL HTTP ou HTTPS valide."
    });
    return;
  }

  if (req.body.description && !validateInput('description', req.body.description, patterns.description)) {
    res.status(400).send({
      message: "La description est trop longue (max 2000 caractères)."
    });
    return;
  }

  Pollution.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollution mise à jour avec succès."
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour la pollution avec id=${id}. Peut-être que la pollution n'a pas été trouvée ou que req.body est vide!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de la pollution avec id=" + id
      });
    });
};

// Supprimer une pollution par id
exports.delete = (req, res) => {
  const id = req.params.id;

  // Validation de l'ID
  if (!/^[0-9]+$/.test(id)) {
    res.status(400).send({
      message: "L'ID doit être un nombre entier positif."
    });
    return;
  }

  Pollution.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollution supprimée avec succès!"
        });
      } else {
        res.send({
          message: `Impossible de supprimer la pollution avec id=${id}. Peut-être que la pollution n'a pas été trouvée!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Impossible de supprimer la pollution avec id=" + id
      });
    });
};

// Supprimer toutes les pollutions
exports.deleteAll = (req, res) => {
  Pollution.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} pollutions ont été supprimées avec succès!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la suppression de toutes les pollutions."
      });
    });
};
