const express = require("express");
const router = express.Router();
const User = require("../model/users");
const bcrypt = require("bcrypt");//encripta contraseñas de registro
// Ruta para mostrar el formulario de inicio de sesión (GET)
router.get("/login", (req, res) => {
  // Renderizar el formulario de inicio de sesión aquí
  res.render("login"); // Aquí debes renderizar el archivo login.pug
});
//ruta para registration
router.post("/register", async (req, res) => {
  try {
    const { Nombre, Apellido, Correo, Password } = req.body;

    // Encriptar la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Crear un nuevo documento de usuario con los datos recibidos del formulario
    const newUser = new User({
      Nombre,
      Apellido,
      Correo,
      Password: hashedPassword, // Guardar la contraseña encriptada
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();
    res.redirect("/auth/login");
    // Redirigir o enviar una respuesta de éxito
    //res.status(200).json({ message: "Registro exitoso", user: newUser });
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
// Ruta para procesar el inicio de sesión (POST)
router.post("/login", async (req, res) => {
  try {
    const { Correo, Password } = req.body;
    // Buscar al usuario en la base de datos por correo
    const user = await User.findOne({ Correo: Correo });
    // Verificar si el usuario existe y si la contraseña es correcta
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    // Comparar la contraseña ingresada con la contraseña encriptada almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    res.redirect("/principal");
  } catch (err) {
    res.status(500).json({ message: "Error de servidor" });
  }
});




module.exports = router;
