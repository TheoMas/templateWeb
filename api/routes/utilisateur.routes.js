module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    let router = require("express").Router();
  
    // Authentification
    router.post("/auth/login", utilisateur.login);

    // Vérification
    router.get("/check/username/:username", utilisateur.checkUsername);

    // CRUD Routes
    router.post("/", utilisateur.create);                          // Créer un utilisateur
    router.get("/", utilisateur.findAll);                          // Récupérer tous les utilisateurs
    router.get("/search", utilisateur.search);                     // Rechercher des utilisateurs
    router.get("/username/:username", utilisateur.findByUsername); // Récupérer par username
    router.get("/:id", utilisateur.findOne);                       // Récupérer par id
    router.put("/:id", utilisateur.update);                        // Mettre à jour (complet)
    router.patch("/:id", utilisateur.update);                      // Mettre à jour (partiel)
    router.delete("/:id", utilisateur.delete);                     // Supprimer
  
    app.use('/api/users', router);
};