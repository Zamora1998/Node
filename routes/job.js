const express = require("express");
const router = express.Router();

// Ruta para renderizar la vista "job.pug"
router.get("/", (req, res) => {
  res.render("job", { title: "Subir PDF" });
});

module.exports = router;
