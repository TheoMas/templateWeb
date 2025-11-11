const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

// Patterns de validation
const patterns = {
  id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  nom: /^[a-zA-ZÀ-ÿ\s\-']{1,100}$/,
  prenom: /^[a-zA-ZÀ-ÿ\s\-']{1,100}$/,
  login: /^[A-Za-z0-9_\-]{3,50}$/,
  pass: /^.{6,255}$/  // Au moins 6 caractères
};

// Fonction de validation
const validateInput = (field, value, pattern) => {
  if (!value) return false;
  return pattern.test(value);
};

// Créer et sauvegarder un nouvel utilisateur
exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.nom || !req.body.prenom || !req.body.login || !req.body.pass) {
    res.status(400).send({
      message: "Le nom, prénom, login et mot de passe sont obligatoires!"
    });
    return;
  }

  // Validation avec regex
  if (!validateInput('nom', req.body.nom, patterns.nom)) {
    res.status(400).send({
      message: "Le nom contient des caractères invalides ou est trop long (max 100 caractères)."
    });
    return;
  }

  if (!validateInput('prenom', req.body.prenom, patterns.prenom)) {
    res.status(400).send({
      message: "Le prénom contient des caractères invalides ou est trop long (max 100 caractères)."
    });
    return;
  }

  if (!validateInput('login', req.body.login, patterns.login)) {
    res.status(400).send({
      message: "Le login doit contenir entre 3 et 50 caractères alphanumériques, tirets ou underscores."
    });
    return;
  }

  if (!validateInput('pass', req.body.pass, patterns.pass)) {
    res.status(400).send({
      message: "Le mot de passe doit contenir au moins 6 caractères."
    });
    return;
  }

  // Vérifier si le login existe déjà
  Utilisateurs.findOne({ where: { login: req.body.login } })
    .then(existingUser => {
      if (existingUser) {
        res.status(409).send({
          message: "Ce login est déjà utilisé."
        });
        return;
      }

      // Créer un utilisateur
      const utilisateur = {
        id: uuidv4(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        login: req.body.login,
        pass: req.body.pass  // En production, utiliser bcrypt pour hasher
      };

      // Sauvegarder l'utilisateur dans la base de données
      Utilisateurs.create(utilisateur)
        .then(data => {
          // Ne pas renvoyer le mot de passe
          const userResponse = {
            id: data.id,
            nom: data.nom,
            prenom: data.prenom,
            login: data.login
          };
          res.status(201).send(userResponse);
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la vérification du login."
      });
    });
};

// Récupérer tous les utilisateurs
exports.findAll = (req, res) => {
  const nom = req.query.nom;
  
  // Validation de la recherche
  if (nom && !validateInput('nom', nom, patterns.nom)) {
    res.status(400).send({
      message: "Le paramètre de recherche contient des caractères invalides."
    });
    return;
  }
  
  let condition = nom ? { nom: { [Op.iLike]: `%${nom}%` } } : null;

  Utilisateurs.findAll({ 
    where: condition,
    attributes: { exclude: ['pass'] }  // Exclure le mot de passe
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des utilisateurs."
      });
    });
};

// Récupérer un utilisateur par id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // Validation de l'ID (UUID)
  if (!validateInput('id', id, patterns.id)) {
    res.status(400).send({
      message: "L'ID doit être un UUID valide."
    });
    return;
  }

  Utilisateurs.findByPk(id, {
    attributes: { exclude: ['pass'] }  // Exclure le mot de passe
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec id=${id} introuvable.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur avec id=" + id
      });
    });
};

// Récupérer un utilisateur par login
exports.findByLogin = (req, res) => {
  const login = req.params.login;

  // Validation du login
  if (!validateInput('login', login, patterns.login)) {
    res.status(400).send({
      message: "Le login contient des caractères invalides."
    });
    return;
  }

  Utilisateurs.findOne({ 
    where: { login: login },
    attributes: { exclude: ['pass'] }  // Exclure le mot de passe
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec login=${login} introuvable.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur avec login=" + login
      });
    });
};

// Mettre à jour un utilisateur par id
exports.update = (req, res) => {
  const id = req.params.id;

  // Validation de l'ID
  if (!validateInput('id', id, patterns.id)) {
    res.status(400).send({
      message: "L'ID doit être un UUID valide."
    });
    return;
  }

  // Validation des champs à mettre à jour
  if (req.body.nom && !validateInput('nom', req.body.nom, patterns.nom)) {
    res.status(400).send({
      message: "Le nom contient des caractères invalides."
    });
    return;
  }

  if (req.body.prenom && !validateInput('prenom', req.body.prenom, patterns.prenom)) {
    res.status(400).send({
      message: "Le prénom contient des caractères invalides."
    });
    return;
  }

  if (req.body.login && !validateInput('login', req.body.login, patterns.login)) {
    res.status(400).send({
      message: "Le login contient des caractères invalides."
    });
    return;
  }

  if (req.body.pass && !validateInput('pass', req.body.pass, patterns.pass)) {
    res.status(400).send({
      message: "Le mot de passe doit contenir au moins 6 caractères."
    });
    return;
  }

  // Si on change le login, vérifier qu'il n'existe pas déjà
  if (req.body.login) {
    Utilisateurs.findOne({ where: { login: req.body.login, id: { [Op.ne]: id } } })
      .then(existingUser => {
        if (existingUser) {
          res.status(409).send({
            message: "Ce login est déjà utilisé par un autre utilisateur."
          });
          return;
        }

        // Mettre à jour l'utilisateur
        performUpdate(id, req.body, res);
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la vérification du login."
        });
      });
  } else {
    // Mettre à jour sans vérifier le login
    performUpdate(id, req.body, res);
  }
};

// Fonction helper pour la mise à jour
const performUpdate = (id, data, res) => {
  Utilisateurs.update(data, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur mis à jour avec succès."
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour l'utilisateur avec id=${id}. Peut-être que l'utilisateur n'a pas été trouvé ou que req.body est vide!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de l'utilisateur avec id=" + id
      });
    });
};

// Supprimer un utilisateur par id
exports.delete = (req, res) => {
  const id = req.params.id;

  // Validation de l'ID
  if (!validateInput('id', id, patterns.id)) {
    res.status(400).send({
      message: "L'ID doit être un UUID valide."
    });
    return;
  }

  Utilisateurs.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur supprimé avec succès!"
        });
      } else {
        res.send({
          message: `Impossible de supprimer l'utilisateur avec id=${id}. Peut-être que l'utilisateur n'a pas été trouvé!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Impossible de supprimer l'utilisateur avec id=" + id
      });
    });
};

// Authentification - Login
exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    pass: req.body.pass
  };

  // Validation
  if (!validateInput('login', utilisateur.login, patterns.login)) {
    res.status(400).send({
      message: "Login invalide."
    });
    return;
  }

  if (!utilisateur.pass) {
    res.status(400).send({
      message: "Mot de passe requis."
    });
    return;
  }

  Utilisateurs.findOne({ where: { login: utilisateur.login } })
    .then(data => {
      if (data) {
        // En production, utiliser bcrypt.compare() pour vérifier le mot de passe hashé
        if (data.pass === utilisateur.pass) {
          // Authentification réussie
          const userResponse = {
            id: data.id,
            nom: data.nom,
            prenom: data.prenom,
            login: data.login,
            token: 'fake-jwt-token-' + data.id  // En production, générer un vrai JWT
          };
          res.send(userResponse);
        } else {
          res.status(401).send({
            message: "Mot de passe incorrect."
          });
        }
      } else {
        res.status(404).send({
          message: `Utilisateur avec login=${utilisateur.login} introuvable.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la connexion avec login=" + utilisateur.login
      });
    });
};

// Vérifier la disponibilité d'un login
exports.checkLogin = (req, res) => {
  const login = req.params.login;

  // Validation du login
  if (!validateInput('login', login, patterns.login)) {
    res.status(400).send({
      message: "Le login contient des caractères invalides."
    });
    return;
  }

  Utilisateurs.findOne({ where: { login: login } })
    .then(data => {
      res.send({
        available: !data  // true si aucun utilisateur trouvé
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la vérification du login."
      });
    });
};

// Rechercher des utilisateurs
exports.search = (req, res) => {
  const { nom, prenom } = req.query;
  let conditions = [];

  if (nom) {
    if (!validateInput('nom', nom, patterns.nom)) {
      res.status(400).send({
        message: "Le paramètre nom contient des caractères invalides."
      });
      return;
    }
    conditions.push({ nom: { [Op.iLike]: `%${nom}%` } });
  }

  if (prenom) {
    if (!validateInput('prenom', prenom, patterns.prenom)) {
      res.status(400).send({
        message: "Le paramètre prenom contient des caractères invalides."
      });
      return;
    }
    conditions.push({ prenom: { [Op.iLike]: `%${prenom}%` } });
  }

  const whereClause = conditions.length > 0 ? { [Op.and]: conditions } : null;

  Utilisateurs.findAll({ 
    where: whereClause,
    attributes: { exclude: ['pass'] }  // Exclure le mot de passe
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la recherche d'utilisateurs."
      });
    });
};
