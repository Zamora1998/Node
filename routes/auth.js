const express = require("express");
const router = express.Router();
const User = require("../model/users");
// Ruta para mostrar el formulario de inicio de sesión (GET)
router.get("/login", (req, res) => {
  // Renderizar el formulario de inicio de sesión aquí
  res.render("login"); // Aquí debes renderizar el archivo login.pug
});
//ruta para registration
router.post("/register", async (req, res) => {
  try {
    const { Nombre, Apellido, Correo, Password } = req.body;
    // Crear un nuevo documento de usuario con los datos recibidos del formulario
    const newUser = new User({
      Nombre,
      Apellido,
      Correo,
      Password,
    });
    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Redirigir o enviar una respuesta de éxito
    res.status(200).json({ message: "Registro exitoso", user: newUser });
  } catch (err) {
    // Manejar errores de validación o de la base de datos
    res.status(500).json({ message: "Error de servidor" });
  }
});
// Ruta para mostrar el formulario de registro (GET)
router.get("/register", (req, res) => {
  res.render("registration"); // Aquí debes renderizar el archivo registration.pug
});

// Ruta para procesar el inicio de sesión (POST)
router.post("/login", async (req, res) => {
  try {
    const { Correo, Password } = req.body;
    // Buscar al usuario en la base de datos por correo
    const user = await User.findOne({ Correo: Correo });
    // Verificar si el usuario existe y si la contraseña es correcta
    if (!user || user.Password !== Password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    // Si las credenciales son correctas, redirigir o enviar una respuesta de éxito
    // Aquí puedes redirigir a una página de inicio de sesión exitoso o devolver un mensaje JSON
    res.status(200).json({ message: "Inicio de sesión exitoso", user: user });
  } catch (err) {
    res.status(500).json({ message: "Error de servidor" });
  }
});

module.exports = router;
