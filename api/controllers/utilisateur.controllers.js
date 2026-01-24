const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

// Patterns de validation
const patterns = {
  username: /^[A-Za-z0-9_\-]{3,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^.{6,255}$/  // Au moins 6 caractères
};

// Fonction de validation
const validateInput = (field, value, pattern) => {
  if (!value) return false;
  return pattern.test(value);
};

// Créer et sauvegarder un nouvel utilisateur
exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Le nom d'utilisateur, l'email et le mot de passe sont obligatoires!"
    });
    return;
  }

  // Validation avec regex
  if (!validateInput('username', req.body.username, patterns.username)) {
    res.status(400).send({
      message: "Le nom d'utilisateur doit contenir entre 3 et 50 caractères alphanumériques, tirets ou underscores."
    });
    return;
  }

  if (!validateInput('email', req.body.email, patterns.email)) {
    res.status(400).send({
      message: "L'email n'est pas valide."
    });
    return;
  }

  if (!validateInput('password', req.body.password, patterns.password)) {
    res.status(400).send({
      message: "Le mot de passe doit contenir au moins 6 caractères."
    });
    return;
  }

  // Vérifier si l'username ou l'email existe déjà
  Utilisateurs.findOne({ 
    where: { 
      [Op.or]: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    } 
  })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.username === req.body.username) {
          res.status(409).send({
            message: "Ce nom d'utilisateur est déjà utilisé."
          });
        } else {
          res.status(409).send({
            message: "Cet email est déjà utilisé."
          });
        }
        return;
      }

      // Créer un utilisateur
      const utilisateur = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password  // En production, utiliser bcrypt pour hasher
      };

      // Sauvegarder l'utilisateur dans la base de données
      Utilisateurs.create(utilisateur)
        .then(data => {
          // Ne pas renvoyer le mot de passe
          const userResponse = {
            id: data.id,
            username: data.username,
            email: data.email
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
        message: err.message || "Erreur lors de la vérification du nom d'utilisateur/email."
      });
    });
};

// Récupérer tous les utilisateurs
exports.findAll = (req, res) => {
  const username = req.query.username;
  
  // Validation de la recherche
  if (username && !validateInput('username', username, patterns.username)) {
    res.status(400).send({
      message: "Le paramètre de recherche contient des caractères invalides."
    });
    return;
  }
  
  let condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;

  Utilisateurs.findAll({ 
    where: condition,
    attributes: { exclude: ['password'] }  // Exclure le mot de passe
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

  Utilisateurs.findByPk(id, {
    attributes: { exclude: ['password'] }  // Exclure le mot de passe
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

// Récupérer un utilisateur par username
exports.findByUsername = (req, res) => {
  const username = req.params.username;

  // Validation du username
  if (!validateInput('username', username, patterns.username)) {
    res.status(400).send({
      message: "Le nom d'utilisateur contient des caractères invalides."
    });
    return;
  }

  Utilisateurs.findOne({ 
    where: { username: username },
    attributes: { exclude: ['password'] }  // Exclure le mot de passe
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec username=${username} introuvable.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur avec username=" + username
      });
    });
};

// Mettre à jour un utilisateur par id
exports.update = (req, res) => {
  const id = req.params.id;

  // Validation des champs à mettre à jour
  if (req.body.username && !validateInput('username', req.body.username, patterns.username)) {
    res.status(400).send({
      message: "Le nom d'utilisateur contient des caractères invalides."
    });
    return;
  }

  if (req.body.email && !validateInput('email', req.body.email, patterns.email)) {
    res.status(400).send({
      message: "L'email n'est pas valide."
    });
    return;
  }

  if (req.body.password && !validateInput('password', req.body.password, patterns.password)) {
    res.status(400).send({
      message: "Le mot de passe doit contenir au moins 6 caractères."
    });
    return;
  }

  // Si on change le username ou l'email, vérifier qu'ils n'existent pas déjà
  if (req.body.username || req.body.email) {
    let conditions = [];
    if (req.body.username) conditions.push({ username: req.body.username });
    if (req.body.email) conditions.push({ email: req.body.email });

    Utilisateurs.findOne({ 
      where: { 
        [Op.and]: [
          { [Op.or]: conditions },
          { id: { [Op.ne]: id } }
        ]
      } 
    })
      .then(existingUser => {
        if (existingUser) {
          if (existingUser.username === req.body.username) {
            res.status(409).send({
              message: "Ce nom d'utilisateur est déjà utilisé."
            });
          } else {
            res.status(409).send({
              message: "Cet email est déjà utilisé."
            });
          }
          return;
        }

        // Mettre à jour l'utilisateur
        performUpdate(id, req.body, res);
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la vérification."
        });
      });
  } else {
    // Mettre à jour sans vérifier
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
  const credentials = {
    email: req.body.email,
    password: req.body.password
  };

  // Validation
  if (!validateInput('email', credentials.email, patterns.email)) {
    res.status(400).send({
      message: "Email invalide."
    });
    return;
  }

  if (!credentials.password) {
    res.status(400).send({
      message: "Mot de passe requis."
    });
    return;
  }

  Utilisateurs.findOne({ where: { email: credentials.email } })
    .then(data => {
      if (data) {
        // En production, utiliser bcrypt.compare() pour vérifier le mot de passe hashé
        if (data.password === credentials.password) {
          // Authentification réussie
          const userResponse = {
            id: data.id,
            username: data.username,
            email: data.email,
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
          message: `Utilisateur avec email=${credentials.email} introuvable.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la connexion avec email=" + credentials.email
      });
    });
};

// Vérifier la disponibilité d'un username
exports.checkUsername = (req, res) => {
  const username = req.params.username;

  // Validation du username
  if (!validateInput('username', username, patterns.username)) {
    res.status(400).send({
      message: "Le nom d'utilisateur contient des caractères invalides."
    });
    return;
  }

  Utilisateurs.findOne({ where: { username: username } })
    .then(data => {
      res.send({
        available: !data  // true si aucun utilisateur trouvé
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la vérification du nom d'utilisateur."
      });
    });
};

// Rechercher des utilisateurs
exports.search = (req, res) => {
  const { username, email } = req.query;
  let conditions = [];

  if (username) {
    if (!validateInput('username', username, patterns.username)) {
      res.status(400).send({
        message: "Le paramètre username contient des caractères invalides."
      });
      return;
    }
    conditions.push({ username: { [Op.iLike]: `%${username}%` } });
  }

  if (email) {
    if (!validateInput('email', email, patterns.email)) {
      res.status(400).send({
        message: "Le paramètre email n'est pas valide."
      });
      return;
    }
    conditions.push({ email: { [Op.iLike]: `%${email}%` } });
  }

  const whereClause = conditions.length > 0 ? { [Op.or]: conditions } : null;

  Utilisateurs.findAll({ 
    where: whereClause,
    attributes: { exclude: ['password'] }  // Exclure le mot de passe
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
