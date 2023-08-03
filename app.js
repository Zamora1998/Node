const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const flash = require("connect-flash");

//ConexionDB
const uri =
  "mongodb+srv://johnnyzamoraguerrero:Mike_1998@aero.ggh1vwv.mongodb.net/Airlane?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//redireccion a login

// Redirección de localhost:3000 a localhost:3000/auth/login
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

//renderizar vista confimacion
app.get("/confirmacion", (req, res) => {
  const data = JSON.parse(req.query.data);
  res.render("confirmacion", { data });
});

///comporardata
app.post("/comprardata", async (req, res) => {
  const { aerolineaId, correo } = req.body;
  if (!correo) {
    return res.status(400).json({ message: "Correo no proporcionado." });
  }
  try {
    // Buscar el usuario en la tabla de usuarios por su correo
    const usuario = await User.findOne({ Correo: correo });
    console.log("Datos del usuario:", usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const updatedAerolinea = await Aerolinea.findByIdAndUpdate(
      aerolineaId,
      { $set: { usuarioId: usuario._id } },
      { new: true }
    );
    // Mostrar los datos de la aerolínea actualizada en la consola
    console.log("Aerolínea actualizada:", updatedAerolinea);
    if (!updatedAerolinea) {
      return res.status(404).json({ message: "Aerolínea no encontrada." });
    }
    res.redirect("/principal");
    return res
  } catch (error) {
    console.error("Error al vincular la aerolínea con el usuario:", error);
    return res
      .status(500)
      .json({
        message: "Error al vincular la aerolínea con el usuario.",
        error: error.message,
      });
  }
});


//trae la data de aerolineas
app.get("/principal", async (req, res) => {
  try {
    const aerolineas = await Aerolinea.find(); 
    res.render("principal", { aerolineas }); 
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los datos de la base de datos" });
  }
});
// Ruta para la página comprar
app.post('/comprar', (req, res) => {
  // Obtén los datos enviados desde el formulario en principal.pug
  const aerolineaId = req.body.aerolineaId;
  const asiento = req.body.asiento;
  const destino = req.body.destino;
  const fechaLlegada = req.body.fechaLlegada;
  const fechaSalida = req.body.fechaSalida;
  const paisSalida = req.body.paisSalida;
  const precio = req.body.precio;
  // Renderiza la vista "comprar.pug" y pasa los datos
  res.render('comprar', {
    aerolineaId,
    asiento,
    destino,
    fechaLlegada,
    fechaSalida,
    paisSalida,
    precio,
  });
});

// Rutas
const indexRouter = require("./routes/index");
const usersRouter = require("./model/users"); // Esto puede estar incorrecto, asegúrate de tener el archivo correcto.
const usersAuth = require("./routes/auth");
const Aerolinea = require("./model/aerolineas.js");
const User = require("./model/users");

app.use("/auth", usersAuth);
app.use("/users", usersRouter);

// Manejo de errores
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Configuración del motor de plantillas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});


//renderisza la data de misvuelos
router.get("/misvuelos", (req, res) => {
  // Aquí debe ir la lógica para obtener y renderizar los vuelos del usuario
  res.render("misvuelos", {
    /* datos de los vuelos */
  });
});


module.exports = app;
