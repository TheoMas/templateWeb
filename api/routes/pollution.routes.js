module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
  
    var router = require("express").Router();
  
    // Créer une nouvelle pollution
    router.post("/", pollution.create);
  
    // Récupérer toutes les pollutions
    router.get("/", pollution.findAll);
  
    // Récupérer une pollution par id
    router.get("/:id", pollution.findOne);
  
    // Mettre à jour une pollution par id
    router.put("/:id", pollution.update);
  
    // Supprimer une pollution par id
    router.delete("/:id", pollution.delete);
  
    // Supprimer toutes les pollutions
    router.delete("/", pollution.deleteAll);
  
    app.use('/api/pollution', router);
  };
