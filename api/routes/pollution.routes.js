module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const authenticateJWT = require("../jwt-middleware");
    let router = require("express").Router();

    // Public read routes
    router.get("/", pollution.findAll);
    router.get("/:id", pollution.findOne);

    // Protected write routes
    router.post("/", authenticateJWT, pollution.create);
    router.put("/:id", authenticateJWT, pollution.update);
    router.delete("/:id", authenticateJWT, pollution.delete);
    router.delete("/", authenticateJWT, pollution.deleteAll);

    app.use('/api/pollutions', router);
};