const express = require("express");
const router = express.Router();
const User = require("../model/users");
const bcrypt = require("bcrypt");//encripta contraseñas de registro
// Ruta para mostrar el formulario de inicio de sesión (GET)
router.get("/login", (req, res) => {
  res.render("login"); 
});
//ruta para registration
router.post("/register", async (req, res) => {
  try {
    const { Nombre, Apellido, Correo, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new User({
      Nombre,
      Apellido,
      Correo,
      Password: hashedPassword, // Guardar la contraseña encriptada
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();
    res.redirect("/auth/login");
  } catch (err) {
    res.status(500).json({ message: "Error de servidor" });
  }
});
// Ruta para mostrar el formulario de registro (GET)
router.get("/register", (req, res) => {
  res.render("registration"); 
});

// Ruta para procesar el inicio de sesión (POST)
router.post("/login", async (req, res) => {
  try {
    const { Correo, Password } = req.body;
    const user = await User.findOne({ Correo: Correo });
    if (!user) {
      // Renderizar la página de inicio de sesión con un mensaje de error
      return res.render("login", {
        error:
          "Credenciales inválidas. Por favor, verifica tus credenciales e intenta de nuevo.",
      });
    }
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      // Renderizar la página de inicio de sesión con un mensaje de error
      return res.render("login", {
        error:
          "Credenciales inválidas. Por favor, verifica tus credenciales e intenta de nuevo.",
      });
    }
    res.redirect("/principal");
  } catch (err) {
    res.status(500).json({ message: "Error de servidor" });
  }
});

module.exports = router;
