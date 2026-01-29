module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
    const authenticateJWT = require("../jwt-middleware.js");
    let router = require("express").Router();

    // Authentification (publiques)
    router.post("/auth/login", utilisateur.login);
    router.post("/auth/refresh", utilisateur.refreshToken);
    router.post("/auth/logout", utilisateur.logout);
    router.get("/check/username/:username", utilisateur.checkUsername);

    // Middleware JWT pour toutes les autres routes
    // Laisser la création d'utilisateur publique (inscription)
    router.post("/", utilisateur.create);                          // Créer un utilisateur (inscription)

    // Middleware JWT pour toutes les autres routes
    router.use(authenticateJWT);

    // CRUD Routes protégées
    router.get("/", utilisateur.findAll);                          // Récupérer tous les utilisateurs
    router.get("/search", utilisateur.search);                     // Rechercher des utilisateurs
    router.get("/username/:username", utilisateur.findByUsername); // Récupérer par username
    router.get("/:id", utilisateur.findOne);                       // Récupérer par id
    router.put("/:id", utilisateur.update);                        // Mettre à jour (complet)
    router.patch("/:id", utilisateur.update);                      // Mettre à jour (partiel)
    router.delete("/:id", utilisateur.delete);                     // Supprimer

    app.use('/api/users', router);
};