module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const authenticateJWT = require("../jwt-middleware.js");
    let router = require("express").Router();

    // Toutes les routes pollutions protégées par JWT
    router.use(authenticateJWT);
    router.post("/", pollution.create);
    router.get("/", pollution.findAll);
    router.get("/:id", pollution.findOne);
    router.put("/:id", pollution.update);
    router.delete("/:id", pollution.delete);
    router.delete("/", pollution.deleteAll);

    app.use('/api/pollutions', router);
};