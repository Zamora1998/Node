const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const flash = require("connect-flash");
const multer = require("multer"); // Middleware para manejar la carga de archivos
const Curriculum = require("./model/curriculum");
const { GridFsStorage } = require("multer-gridfs-storage"); 

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
const usersRouter = require("./model/users"); 
const usersAuth = require("./routes/auth");
const Aerolinea = require("./model/aerolineas.js");
const User = require("./model/users");
const jobRouter = require("./routes/job");

app.use("/auth", usersAuth);
app.use("/users", usersRouter);

// Manejo de errores
//app.use(function (req, res, next) {
  //next(createError(404));
//});

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
  res.render("misvuelos", {
  });
});

//carga de archivo PDF
app.use("/job", jobRouter);

const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return {
      bucketName: "uploads",
      filename: file.originalname,
    };
  },
});

const upload = multer({ storage });

// Ruta para manejar la carga de archivos y vincularlo al modelo "Curriculum"
app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    // Crea un nuevo documento "Curriculum" con el nombre proporcionado y la referencia al archivo PDF
    const nuevoCurriculum = new Curriculum({
      Nombre: req.body.Nombre,
      pdfFile: {
        filename: req.file.originalname,
        fileId: req.file.id,
      },
    });
    await nuevoCurriculum.save();

    // Renderiza la vista de éxito y muestra el mensaje antes de redirigir
    res.render("success"); // Renderiza el archivo success.pug
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error al subir el archivo y vincularlo al curriculum.");
  }
});
module.exports = app;

//filtro para curriculum

app.get("/admincurriculum", async (req, res) => {
  try {
    const { nombreFiltro } = req.query;
    let query = {};
    if (nombreFiltro) {
      query.Nombre = { $regex: new RegExp(nombreFiltro, "i") };
    }

    const curriculums = await Curriculum.find(query);
    res.render("admincurriculum", { curriculums });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la lista de currículums.");
  }
});


app.get("/download/:nombre", async (req, res) => {
  try {
    const nombre = req.params.nombre;

    // Buscar el documento en la colección "curriculums" por el nombre
    const curriculum = await Curriculum.findOne({ Nombre: nombre });

    if (!curriculum) {
      return res.status(404).send("Currículum no encontrado.");
    }

    const fileId = curriculum.pdfFile.fileId;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads.files",
    });

    const downloadStream = bucket.openDownloadStream(new ObjectID(fileId));

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${curriculum.Nombre}.pdf`
    );

    downloadStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al descargar el archivo PDF.");
  }
});

