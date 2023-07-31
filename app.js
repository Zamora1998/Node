const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();

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


//trae la data de aerolineas
app.get("/principal", async (req, res) => {
  try {
    const aerolineas = await Aerolinea.find(); // Consulta todas las aerolíneas desde la base de datos
    res.render("principal", { aerolineas }); // Pasa las aerolíneas a la plantilla "principal.pug"
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los datos de la base de datos" });
  }
});



// Rutas
const indexRouter = require("./routes/index");
const usersRouter = require("./model/users"); // Esto puede estar incorrecto, asegúrate de tener el archivo correcto.
const usersAuth = require("./routes/auth");
const Aerolinea = require("./model/aerolineas.js");

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

module.exports = app;
