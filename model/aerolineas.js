const mongoose = require("mongoose");

// Definimos el esquema para la colección "Aerolineas"
const aerolineaSchema = new mongoose.Schema({
  Aerolinea: {
    type: String,
    required: true,
  },
  Asiento: {
    type: String,
    required: true,
  },
  Destino: {
    type: String,
    required: true,
  },
  FechaLlegada: {
    type: String,
    required: true,
  },
  FechaSalida: {
    type: String,
    required: true,
  },
  PaisSalida: {
    type: String,
    required: true,
  },
  Precio: {
    type: String,
    required: true,
  },
    tipoPago: {
    type: String,
    required: true,
    },
     usuarioId: {          // Este es el campo que vincula el usuario con la aerolínea
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',       // Referencia a la colección 'users' (nombre de la colección en la base de datos)
    default: null,      // Valor por defecto, puede ser null inicialmente
  },
});

// Creamos el modelo "Aerolinea" basado en el esquema
const Aerolinea = mongoose.model("aerolineas", aerolineaSchema);

module.exports = Aerolinea;
