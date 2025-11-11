module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    let router = require("express").Router();
  
    // Authentification
    router.post("/auth/login", utilisateur.login);

    // Vérification
    router.get("/check/login/:login", utilisateur.checkLogin);

    // CRUD Routes
    router.post("/", utilisateur.create);                    // Créer un utilisateur
    router.get("/", utilisateur.findAll);                    // Récupérer tous les utilisateurs
    router.get("/search", utilisateur.search);               // Rechercher des utilisateurs
    router.get("/login/:login", utilisateur.findByLogin);    // Récupérer par login
    router.get("/:id", utilisateur.findOne);                 // Récupérer par id
    router.put("/:id", utilisateur.update);                  // Mettre à jour (complet)
    router.patch("/:id", utilisateur.update);                // Mettre à jour (partiel)
    router.delete("/:id", utilisateur.delete);               // Supprimer
  
    app.use('/api/users', router);
};